// Stateful ticket service

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import config from '../../config';
import { FirestoreService } from '../firestore/firestore.service';
import { AuthService } from '../auth/auth.service';
import currency from 'currency.js';
import { IFraudPreventionCode } from '../../interfaces/fraud-prevention-code.interface';
import { tap, catchError } from 'rxjs/operators';
import { of, Subscription } from 'rxjs';
import { Observable } from 'rxjs';
import { AlertService } from '../utilities/alert.service';
import { getPayersDescription, getSubtotal, countItemsOnMyTab, isItemOnMyTab, getTicketUsersDescription } from '../../utilities/ticket.utilities';

export interface FirestoreTicketItem {
  name: string,
  payersDescription: string,
  price: number,
  ticket_item_id: number,
  isItemOnMyTab: boolean,
  users: { name: string, price: number, uid: string }[],
}

export interface FirestoreTicket {
  id: number,
  date_created: Date,
  location: string,
  tab_id: string,
  ticket_number: number,
  uids: string[],
  users: { name: string, uid: string }[],
  ticketItems: FirestoreTicketItem[],
}

@Injectable()
export class TicketService {
  private firestoreTicket$!: Subscription;
  private firestoreTicketItems$!: Subscription;

  public firestoreTicket!: FirestoreTicket;
  public firestoreTicketItems!: FirestoreTicketItem[];

  // used to track number of items that current user has selected
  userSelectedItemsCount: number = 0;
  userSubtotal: number = 0;
  ticketUsersDescription: string = getTicketUsersDescription();

  hasInitializationError = false;

  constructor(
    private readonly http: HttpClient,
    private firestoreService: FirestoreService,
    private auth: AuthService,
    public alertCtrl: AlertService,
    // public navCtrl: NavController,
  ) { }

  async getTicket(tab_id: string, omnivoreLocationId: string, fraudPreventionCode: IFraudPreventionCode) {
    try {
      const params = {
        ticket_number: tab_id,
        location: String(omnivoreLocationId),
        fraudPreventionCodeId: String(fraudPreventionCode.id),
      };
      const ticket = await this.http
        .get(`${config.serverUrl}/ticket`, { params })
        .toPromise();

      return {
        ticket: ticket,
        error: null,
      };
    } catch (error) {
      return {
        ticket: null,
        error: error,
      };
    }
  }

  getFirestoreTicket(ticketId: number) {
    return this.firestoreService.document$(`tickets/${ticketId}/`);
  }

  getFirestoreTicketItems(ticketId: number) {
    return this.firestoreService.collection$(`tickets/${ticketId}/ticketItems`);
  }

  initializeFirestoreTicket(ticketId: any) {
    this.firestoreTicket$ = this.getFirestoreTicket(ticketId)
      .pipe(
        catchError(message => this.handleInitializationError(message)),
        tap(ticket => this.onTicketUpdate(ticket as FirestoreTicket))
      )
      .subscribe();

    this.firestoreTicketItems$ = this.getFirestoreTicketItems(ticketId)
      .pipe(
        catchError(message => this.handleInitializationError(message)),
        tap(items => this.onTicketItemsUpdate(items as FirestoreTicketItem[]))
      )
      .subscribe();
  }

  async handleInitializationError(error: any) {
    if (!this.hasInitializationError) {
      this.hasInitializationError = true;
      const alert = this.alertCtrl.create({
        title: 'Error',
        message: `An error occurred while initializing this ticket. Please try again. ${error.message ||
          error}`,
        buttons: [
          {
            text: 'Ok',
          },
        ],
      });
      await alert.present();
      // await this.navCtrl.popTo('TabLookupPage');
    }
    return of(error);
  }

  onTicketItemsUpdate(firestoreTicketItems: FirestoreTicketItem[]) {
    this.firestoreTicketItems = firestoreTicketItems.map((item: FirestoreTicketItem) =>
      ({ ...item, isItemOnMyTab: isItemOnMyTab(item, this.auth.getUid()), }));
    this.userSubtotal = getSubtotal(firestoreTicketItems, this.auth.getUid());
    this.userSelectedItemsCount = countItemsOnMyTab(firestoreTicketItems, this.auth.getUid());
  }

  onTicketUpdate(firestoreTicket: FirestoreTicket) {
    console.log('updating the ticket', firestoreTicket)
    this.firestoreTicket = firestoreTicket;
    this.ticketUsersDescription = getTicketUsersDescription(firestoreTicket.users);
  }

  async addUserToFirestoreTicketItem(
    ticketItemId: any
  ): Promise<{ success: boolean; message: string }> {
    try {
      await this.firestoreService.runTransaction(async transaction => {
        const ticketItemDocRef = this.firestoreService.document(
          `tickets/${this.firestoreTicket!.id}/ticketItems/${ticketItemId}`
        ).ref;
        const ticketItem = await transaction.get(ticketItemDocRef);
        if (!ticketItem.exists) {
          throw 'Document does not exist!';
        }
        const uid = this.auth.getUid();
        const displayName = this.auth.getDisplayName();

        let { users, price } = ticketItem.data()! as {
          users: any[];
          price: number;
        };

        if (users.find(u => u.uid === uid))
          throw 'This item has already been added to your tab.';
        users.push({
          uid: this.auth.getUid(),
          name: this.auth.getDisplayName(),
          price: 0,
        });

        const { length: numberOfPayers } = users;
        currency(price / 100)
          .distribute(numberOfPayers)
          .forEach((d, index) => {
            users[index].price = d.intValue;
          });

        const payersDescription = getPayersDescription(users);
        return transaction.set(
          ticketItemDocRef,
          { payersDescription, users },
          { merge: true }
        );
      });
      return {
        success: true,
        message: 'Ticket item added to tab successfully.',
      };
    } catch (error) {
      console.log('transaction failed', error);
      return {
        success: false,
        message: error,
      };
    }
  }

  async removeUserFromFirestoreTicketItem(
    ticketItemId: any
  ): Promise<{ success: boolean; message: string }> {
    try {
      await this.firestoreService.runTransaction(async transaction => {
        const ticketItemDocRef = this.firestoreService.document(
          `tickets/${this.firestoreTicket!.id}/ticketItems/${ticketItemId}`
        ).ref;
        const ticketItem = await transaction.get(ticketItemDocRef);
        if (!ticketItem.exists) {
          throw 'Document does not exist!';
        }
        const uid = this.auth.getUid();
        const displayName = this.auth.getDisplayName();

        let { users, price } = ticketItem.data()! as {
          users: any[];
          price: number;
        };

        if (!users.find(u => u.uid === uid))
          throw 'This item has already been removed from your tab.';

        users = users.filter(u => u.uid !== uid);
        const { length: numberOfPayers } = users;
        currency(price / 100)
          .distribute(numberOfPayers)
          .forEach((d, index) => {
            users[index].price = d.intValue;
          });

        const payersDescription = getPayersDescription(users);
        return transaction.set(
          ticketItemDocRef,
          { payersDescription, users },
          { merge: true }
        );
      });
      return {
        success: true,
        message: 'Ticket item removed from tab successfully.',
      };
    } catch (error) {
      console.log('Transaction failed', error);
      return {
        success: false,
        message: error,
      };
    }
  }

  // async addAllItemsToMyTab() {
  //   for (const item of this.ticket.firestoreTicketItems!) {
  //     if (!this.isItemOnMyTab(item)) await this.addItemToMyTab(item);
  //   }
  // }

  // async removeAllItemsFromMyTab() {
  //   for (const item of this.ticket.firestoreTicketItems!) {
  //     if (!this.isItemOnMyTab(item)) await this.removeItemFromMyTab(item);
  //   }
  // }
}
