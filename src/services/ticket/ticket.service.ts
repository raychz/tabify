// Stateful ticket service

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@tabify/env';
import { FirestoreService } from '../firestore/firestore.service';
import { AuthService } from '../auth/auth.service';
import currency from 'currency.js';
import { IFraudPreventionCode } from '../../interfaces/fraud-prevention-code.interface';
import { tap, catchError } from 'rxjs/operators';
import { of, Subscription, BehaviorSubject } from 'rxjs';
import { AlertService } from '../utilities/alert.service';
import { getPayersDescription, getSubtotal, countItemsOnMyTab, isItemOnMyTab, getSelectItemsTicketUsersDescription } from '../../utilities/ticket.utilities';

// please keep the user status enum in order of execution as they are used for calculations
export enum UserStatus { Selecting, Waiting, Confirmed, Paying, Paid }
export enum TicketStatus { Open, Closed }

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
  status: TicketStatus,
  overallUsersProgress: UserStatus,
  uids: string[],
  users: { name: string, uid: string, photoUrl: string, status: UserStatus }[],
  ticketItems: FirestoreTicketItem[],
}

export interface User {
  uid: string,
  photoUrl: string,
  name: string,
  status: UserStatus,
  ticketItems: FirestoreTicketItem[],
  subtotal: number,
  isExpanded?: boolean,
}

@Injectable()
export class TicketService {
  // Public class variables
  // Consumers of this service should bind to these public variables to remain up to date with the state of the ticket
  public firestoreTicket: FirestoreTicket;
  public firestoreTicketItems: FirestoreTicketItem[];
  public sharedItems: FirestoreTicketItem[] = [];
  public unclaimedItems: FirestoreTicketItem[] = [];
  public users: User[];
  public curUser: User;
  public userSelectedItemsCount: number = 0;
  /** The value is represented in pennies. */
  public userSubtotal: number = 0;
  public userTipPercentage: number = 18;
  /** The value is represented in pennies. */
  public userTip: number = 0;
  public userTaxRate: number = 0.0625;
  /** The value is represented in pennies. */
  public userTax: number = 0;
  /** The value is represented in pennies. */
  public userGrandTotal: number = 0;
  public userPaymentMethod: any;
  public ticketUsersDescription: string = getSelectItemsTicketUsersDescription();
  public hasInitializationError = false;
  public isExpandedList: { [uid: string]: boolean } = {};
  public firestoreStatus$ = new BehaviorSubject<boolean>(false);

  // Private class variables
  private firestoreTicket$: Subscription;
  private firestoreTicketItems$: Subscription;

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
        .get(`${environment.serverUrl}/ticket`, { params })
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

  public findUserShareOfItem(item: FirestoreTicketItem, userUid: string) {
    const user = item.users.find((u) => u.uid === userUid);
    if (user) {
      return user.price;
    }
    return 0;
  }

  public async changeUserStatus(status?: UserStatus): Promise<{ success: boolean; message: string }> {
    try {
      await this.firestoreService.runTransaction(async transaction => {
        const ticketDocRef = this.firestoreService.document(
          `tickets/${this.firestoreTicket.id}`
        ).ref;
        const ticket = await transaction.get(ticketDocRef);
        if (!ticket.exists) {
          throw 'Ticket Document does not exist!';
        }

        let { users, overallUsersProgress } = ticket.data()! as {
          users: { status: UserStatus, uid: string }[];
          overallUsersProgress: UserStatus;
        };

        // TODO: Coordinate with Sahil to figure out if the below makes sense
        // /**
        //  * If we are attempting to set a status of Selecting or Waiting and all users are already Confirmed or greater,
        //  * throw an error!
        //  */
        // if (status < UserStatus.Confirmed && users.every(user => user.status >= UserStatus.Confirmed)) {
        //   throw 'All users have confirmed their selections already.';
        // }
        let lowestStatus = overallUsersProgress;
        let highestStatus = overallUsersProgress;
        let highestStatusCount = 0;

        for (let user of users) {
          if (user.uid === this.auth.getUid() && status !== undefined) {
            user.status = status;
          }

          if (user.status > highestStatus) {
            if (highestStatusCount === 0) {
              highestStatus = user.status;
            } else {
              highestStatusCount = 0;
            }
          } else if (user.status < lowestStatus) {
            lowestStatus = user.status
          }

          if (user.status === highestStatus) {
            highestStatusCount++;
          }
        }

        if (lowestStatus < overallUsersProgress) {
          overallUsersProgress = lowestStatus;
        } else if (highestStatusCount === users.length) {
          overallUsersProgress = highestStatus;
        }


        transaction.set(
          ticketDocRef,
          { users, overallUsersProgress },
          { merge: true }
        );

        return transaction
      });
      return {
        success: true,
        message: 'User statuses updated',
      };
    } catch (error) {
      console.log('transaction failed', error);
      return {
        success: false,
        message: error,
      };
    }
  }

  public getTicketItemName(name: string) {
    if (name.toLowerCase().includes('taco')) {
      return `🌮 ${name}`;
    } else if (name.toLowerCase().includes('pizza')) {
      return `🍕 ${name}`;
    }
    return name;
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

        const uid = this.auth.getUid();
        const displayName = this.auth.getDisplayName();

        let { users, price } = ticketItem.data()! as {
          users: any[];
          price: number;
        };

        if (users.find(u => u.uid === uid)) {
          throw 'This item has already been added to your tab.';
        }
        users.push({
          uid: uid,
          name: displayName,
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
        transaction.set(
          ticketItemDocRef,
          { payersDescription, users },
          { merge: true }
        );

        return transaction
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
    // the above properties can be inferred from the below properties. ToDo: get rid of above properties
    this.updateItemsAndUsers();
    this.firestoreStatus$.next(true);
  }

  private updateItemsAndUsers() {
    this.unclaimedItems = [];
    this.sharedItems = [];
    this.curUser = { ...this.firestoreTicket.users.find((user) => user.uid === this.auth.getUid())!, ticketItems: [], subtotal: 0 };
    this.users = this.firestoreTicket.users.map((user) => ({ ...user, ticketItems: [], subtotal: 0 }));
    this.firestoreTicketItems.forEach((item) => {
      if (item.users.length < 1) {
        this.unclaimedItems.push(item);
      } else if (item.users.length > 1) {
        this.sharedItems.push(item);
      }

      if (item.isItemOnMyTab) {
        this.curUser.ticketItems.push(item);
        this.curUser.subtotal += item.price;
      }

      item.users.forEach((user) => {
        const userIndex = this.users.findIndex(u => u.uid === user.uid);
        this.users[userIndex].ticketItems.push(item);
        this.users[userIndex].subtotal += item.price;
      });
    });
  }

  resetIsExpanded() {
    for (let user of this.firestoreTicket.users) {
      this.isExpandedList[user.uid] = false;
    }
  }

  toggleIsExpanded(user: User) {
    const isExpanded = this.getUserExpanded(user)
    this.isExpandedList[user.uid] = !isExpanded;
  }

  getUserExpanded(user: User): boolean {
    if (!this.isExpandedList[user.uid]) {
      this.isExpandedList[user.uid] = false;
    }
    return this.isExpandedList[user.uid];
  }

  /**
   * Called when the Firestore ticket document is updated.
   * @param firestoreTicket
   */
  private onTicketUpdate(firestoreTicket: FirestoreTicket) {
    if (Object.keys(this.isExpandedList).length !== firestoreTicket.users.length) {
      for (let user of firestoreTicket.users) {
        if (!this.isExpandedList[user.uid]!) {
          this.isExpandedList[user.uid] = false;
        }
      }
    }

    console.log(this.firestoreTicket);
    console.log('updating the ticket', firestoreTicket)
    this.firestoreTicket = firestoreTicket;
    console.log(this.firestoreTicket);
    this.ticketUsersDescription = getSelectItemsTicketUsersDescription(firestoreTicket.users);
    this.changeUserStatus();
    if (this.firestoreTicketItems && this.users) {
      this.updateItemsAndUsers();
    } else {
      this.users = this.firestoreTicket.users.map((user) => ({ ...user, ticketItems: [], subtotal: 0 }));
    }
  }
}
