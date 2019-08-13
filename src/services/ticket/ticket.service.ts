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
import { user } from '../../pages/home/example-stories';

export interface FirestoreTicketItem {
  name: string,
  payersDescription: string,
  price: number,
  ticket_item_id: number,
  isItemOnMyTab: boolean,
  users: { name: string, price: number, uid: string }[],
  loading?: boolean,
  rating?: number,
  feedback?: string,
  userShare?: number,
}

export interface FirestoreTicket {
  id: number,
  date_created: Date,
  location: string,
  tab_id: string,
  ticket_number: number,
  uids: string[],
  curUser: User,
  users: User[],
  ticketItems: FirestoreTicketItem[],
  sharedItems: FirestoreTicketItem[],
  unclaimedItems: FirestoreTicketItem[],
}

export interface User {
  uid: string,
  photoUrl: string,
  name: string,
  ticketItems: FirestoreTicketItem[],
  subtotal: number,
}

@Injectable()
export class TicketService {
  // Public class variables
  // Consumers of this service should bind to these public variables to remain up to date with the state of the ticket
  public firestoreTicket!: FirestoreTicket;
  public firestoreTicketItems!: FirestoreTicketItem[];
  public userSelectedItemsCount: number = 0;
  public userSubtotal: number = 0;
  public ticketUsersDescription: string = getTicketUsersDescription();
  public hasInitializationError = false;

  // Private class variables
  private firestoreTicket$!: Subscription;
  private firestoreTicketItems$!: Subscription;

  constructor(
    private readonly http: HttpClient,
    private firestoreService: FirestoreService,
    private auth: AuthService,
    public alertCtrl: AlertService,
  ) { }

  /**
   * Sends a request to retrieve a ticket object from tabify-server's database (not Firestore).
   * @param tab_id
   * @param omnivoreLocationId
   * @param fraudPreventionCode
   */
  public async getTicket(tab_id: string, omnivoreLocationId: string, fraudPreventionCode: IFraudPreventionCode) {
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

  /**
   * Subscribes to changes made on the Firestore ticket and ticket-items objects.
   * @param ticketId
   */
  public initializeFirestoreTicket(ticketId: any) {
    this.firestoreTicket$ = this.getFirestoreTicket(ticketId)
      .pipe(
        catchError(message => this.handleInitializationError(message)),
        tap((ticket: any) => this.onTicketUpdate(ticket as FirestoreTicket))
      )
      .subscribe();

    this.firestoreTicketItems$ = this.getFirestoreTicketItems(ticketId)
      .pipe(
        catchError(message => this.handleInitializationError(message)),
        tap((items: any) => this.onTicketItemsUpdate(items as FirestoreTicketItem[]))
      )
      .subscribe();
  }

  /**
   * Destroys active Firestore subscriptions.
   */
  public destroySubscriptions() {
    this.firestoreTicket$ && this.firestoreTicket$.unsubscribe();
    this.firestoreTicketItems$ && this.firestoreTicketItems$.unsubscribe();
  }

  /**
   * Adds user to Firestore ticket item with id `ticketItemId`.
   * @param ticketItemId
   */
  public async addUserToFirestoreTicketItem(
    ticketItemId: any
  ): Promise<{ success: boolean; message: string }> {
    try {
      await this.firestoreService.runTransaction(async transaction => {
        const ticketItemDocRef = this.firestoreService.document(
          `tickets/${this.firestoreTicket!.id}/ticketItems/${ticketItemId}`
        ).ref;
        const ticketItem = await transaction.get(ticketItemDocRef);
        if (!ticketItem.exists) {
          throw 'Ticket Item Document does not exist!';
        }

        const ticketDocRef = this.firestoreService.document(
          `tickets/${this.firestoreTicket!.id}`
        ).ref;
        const ticket = await transaction.get(ticketDocRef);

        const uid = this.auth.getUid();
        const displayName = this.auth.getDisplayName();

        let { name, users, price } = ticketItem.data()! as {
          name: string;
          users: any[];
          price: number;
        };

        const { sharedItems, unclaimedItems } = ticket.data()! as {
          sharedItems: {name: string; users: any[]; price: number}[],
          unclaimedItems: {name: string; users: any[]; price: number}[]
        }

        if (users.find(u => u.uid === uid)) {
          throw 'This item has already been added to your tab.';
        }
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
        transaction.set(
          ticketItemDocRef,
          { payersDescription, users },
          { merge: true }
        );

        if (numberOfPayers > 1) {
          sharedItems.push({ name, users, price });
        }

        const newUnclaimed = unclaimedItems.filter( (item) => { item.users.length > 0 });
        transaction.set(
          ticketDocRef,
          { sharedItems, unclaimedItems },
          { merge: true }
        );

        return transaction
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

  /**
   * Removes user from Firestore ticket item with id `ticketItemId`.
   * @param ticketItemId
   */
  public async removeUserFromFirestoreTicketItem(
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

  /**
   * Gets the Firestore ticket document for ticket with id `ticketId`.
   * @param ticketId
   */
  private getFirestoreTicket(ticketId: number) {
    return this.firestoreService.document$(`tickets/${ticketId}/`);
  }

  /**
   * Gets the Firestore ticket-item collection for ticket with id `ticketId`.
   * @param ticketId
   */
  private getFirestoreTicketItems(ticketId: number) {
    return this.firestoreService.collection$(`tickets/${ticketId}/ticketItems`);
  }

  /**
   * Called when an error is thrown during the Firestore initialization.
   * TODO: Make this an observable so that consumers of the ticket-service can detect and handle errors on their own.
   * @param error
   */
  private async handleInitializationError(error: any) {
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

  /**
   * Called when a Firestore document within the Firestore ticket-items collection is updated.
   * @param firestoreTicketItems
   */
  private onTicketItemsUpdate(firestoreTicketItems: FirestoreTicketItem[]) {
    this.firestoreTicketItems = firestoreTicketItems.map((item: FirestoreTicketItem) =>
      ({ ...item, isItemOnMyTab: isItemOnMyTab(item, this.auth.getUid()), }));
    this.userSubtotal = getSubtotal(firestoreTicketItems, this.auth.getUid());
    this.userSelectedItemsCount = countItemsOnMyTab(firestoreTicketItems, this.auth.getUid());
  }

  /**
   * Called when the Firestore ticket document is updated.
   * @param firestoreTicket
   */
  private onTicketUpdate(firestoreTicket: FirestoreTicket) {
    console.log('updating the ticket', firestoreTicket)
    this.firestoreTicket = firestoreTicket;
    this.ticketUsersDescription = getTicketUsersDescription(firestoreTicket.users);
  }
}
