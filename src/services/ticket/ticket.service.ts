// Stateful ticket service
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@tabify/env';
import { FirestoreService } from '../firestore/firestore.service';
import { AuthService } from '../auth/auth.service';
import currency from 'currency.js';
import { FraudPreventionCode } from '../../interfaces/fraud-prevention-code.interface';
import { tap, catchError } from 'rxjs/operators';
import { of, Subscription, BehaviorSubject } from 'rxjs';
import { AlertService } from '../utilities/alert.service';
import { getPayersDescription, isItemOnMyTab, getSelectItemsTicketUsersDescription } from '../../utilities/ticket.utilities';
import { HttpParams } from '@angular/common/http/src/params';
import { TicketItem } from '../../interfaces/ticket-item.interface';
import { TicketUser } from '../../interfaces/ticket-user.interface';

// please keep the user status enum in order of execution as they are used for calculations
export enum UserStatus { Selecting, Waiting, Confirmed, Paying, Paid }
export enum TicketStatus { Open, Closed }

export interface FirestoreTicketItem {
  name: string,
  payersDescription: string,
  price: number,
  ticket_item_id: number,
  quantity: number,
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
  location: { name: string, id: string, omnivore_id: string },
  tab_id: string,
  ticket_number: number,
  status: TicketStatus,
  ticketTotal: {
    date_created: string,
    date_updated: string,
    discounts: number,
    due: number,
    id: number,
    items: number,
    other_charges: number,
    service_charges: number,
    sub_total: number,
    tax: number,
    tips: number,
    total: number
  }
  uids: string[],
  ticketItems: FirestoreTicketItem[],
}

export interface User {
  name: string,
  uid: string,
  photoUrl: string,
  status: UserStatus,
  totals: {
    tax: number, // user's share of the tax
    tip: number, // user's tip
    subtotal: number, // user's sum of the share of their selected items
    total: number, // user's tax + tip + subtotal
  },
  ticketItems: FirestoreTicketItem[],
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
  /** The value is represented in pennies. */
  public userTipPercentage: number = 18;
  /** The value is represented in pennies. */
  public userPaymentMethod: any;
  public ticketUsersDescription: string = getSelectItemsTicketUsersDescription();
  public hasInitializationError = false;
  public isExpandedList: { [uid: string]: boolean } = {};
  public overallUsersProgress: UserStatus = UserStatus.Selecting;
  public firestoreStatus$ = new BehaviorSubject<boolean>(false);
  public amountPaid = 0;

  /** Database representation of ticket */
  public ticket: any;

  // Private class variables
  private firestoreTicket$: Subscription;
  private firestoreTicketItems$: Subscription;
  private firestoreUsers$: Subscription;

  constructor(
    private readonly http: HttpClient,
    private firestoreService: FirestoreService,
    private auth: AuthService,
    public alertCtrl: AlertService,
  ) { }

  /**
   * Sends a request to retrieve a ticket object from tabify-server's database (not Firestore).
   * @param ticketNumber
   * @param locationId
   * @param ticketStatus
   */
  public async getTicket(ticketNumber: number, locationId: number, ticketStatus: string, openedRecently: boolean) {
    const params = {
      opened_recently: String(openedRecently),
      ticket_number: String(ticketNumber),
      location: String(locationId), // Corresponds to location id in Tabify's db
      ticket_status: ticketStatus
    };
    const ticket = await this.http
      .get(`${environment.serverUrl}/tickets/`, { params })
      .toPromise();
    this.ticket = ticket;
    return ticket;
  }

  /**
   * Sends a request to create a ticket object in tabify-server's database (not Firestore).
   * @param ticketNumber
   * @param locationId
   */
  public async createTicket(ticketNumber: number, locationId: number, openedRecently: boolean) {
    const body = {
      ticket_number: String(ticketNumber),
      location: String(locationId), // Corresponds to location id in Tabify's db
      opened_recently: String(openedRecently),
    };

    const ticket = await this.http
      .post(`${environment.serverUrl}/tickets`, body)
      .toPromise();
    this.ticket = ticket;
    return ticket;
  }

  /** Sends a request to finalize the ticket totals */
  public async finalizeTicketTotals(ticketId: number) {
    return await this.http
      .post(`${environment.serverUrl}/tickets/${ticketId}/finalizeTotals`, {})
      .toPromise();
  }

  public async addUserToDatabaseTicket(ticketId: number) {
    return await this.http
      .post<TicketUser>(`${environment.serverUrl}/tickets/${ticketId}/users`, {})
      .toPromise();
  }

  public async addUserToTicketItem(ticketId: number, ticketUserId: number, itemId: number) {
    return await this.http
      .post(`${environment.serverUrl}/tickets/${ticketId}/items/${itemId}/users/${ticketUserId}`, {})
      .toPromise();
  }

  public async removeUserFromTicketItem(ticketId: number, ticketUserId: number, itemId: number) {
    return await this.http
      .delete(`${environment.serverUrl}/tickets/${ticketId}/items/${itemId}/users/${ticketUserId}`)
      .toPromise();
  }

  public async addUserToFirestoreTicket(ticketId: number) {
    return await this.http
      .post(`${environment.serverUrl}/tickets/${ticketId}/addFirestoreUser`, {})
      .toPromise();
  }

  public async addTicketNumberToFraudCode(ticketId: number, fraudPreventionCodeId: number) {
    const body = {
      fraudPreventionCodeId
    };

    return await this.http
      .post(`${environment.serverUrl}/tickets/${ticketId}/fraudCode`, body)
      .toPromise();
  }

  /** set service variables to their original value to clear the state of the service and destroy observable subscriptions */
  public clearState() {
    this.firestoreTicket = undefined;
    this.firestoreTicketItems = undefined;
    this.sharedItems = [];
    this.unclaimedItems = [];
    this.users = undefined;
    this.curUser = undefined;
    this.userTipPercentage = 18;
    this.userPaymentMethod = undefined;
    this.ticketUsersDescription = getSelectItemsTicketUsersDescription();
    this.hasInitializationError = false;
    this.isExpandedList = {};
    this.overallUsersProgress = UserStatus.Selecting;
    this.firestoreStatus$ = new BehaviorSubject<boolean>(false);
    this.amountPaid = 0;
    this.ticket = undefined;
    this.destroySubscriptions();
  }

  public findUserShareOfItem(item: TicketItem, uid: string) {
    console.log("CALLING", item, uid);
    return item.users.find(u => u.user.uid === uid).price;
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

    this.firestoreUsers$ = this.getFirestoreUsers(ticketId)
      .pipe(
      catchError(message => this.handleInitializationError(message)),
      tap((users: any) => this.onTicketUsersUpdate(users as User[]))
      )
      .subscribe();
  }

  /**
   * Destroys active Firestore subscriptions.
   */
  public destroySubscriptions() {
    this.firestoreTicket$ && this.firestoreTicket$.unsubscribe();
    this.firestoreTicketItems$ && this.firestoreTicketItems$.unsubscribe();
    this.firestoreUsers$ && this.firestoreUsers$.unsubscribe();
  }

  public async changeUserStatus(status: UserStatus): Promise<{ success: boolean; message: string }> {
    try {
      await this.firestoreService.runTransaction(async transaction => {
        const ticketUsersRef = this.firestoreService.collection(
          `tickets/${this.firestoreTicket.id}/users`
        ).ref;
        const userCollectionData = await ticketUsersRef.get();
        const users = userCollectionData.docs.map(doc => doc.data()) as User[];


        // let { users } = ticket.data()! as {
        //   users: { status: UserStatus, uid: string }[];
        // };

        // if (status < UserStatus.Confirmed && users.every(user => user.status >= UserStatus.Confirmed)) {
        //   throw 'All users have already confirmed, cannot set status to selecting or waiting'
        // }
        // if (status < UserStatus.Paid && users.every(user => user.status >= UserStatus.Paid)) {
        //   throw 'All users have already paid, cannot set status to anything other than paid'
        // }

        const docs = userCollectionData.docs;
        for (const doc of docs) {
          const userUid = doc.get('uid');
          const authUid = this.auth.getUid();
          if (userUid === authUid) {
            const user = users.find(u => u.uid === authUid);
            if (user) {
              user.status = status;
              transaction.set(
                doc.ref,
                user,
                { merge: true },
              );
            }
            break;
          }
        }

        return transaction;
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
 * Gets the Firestore users collection for ticket with id `ticketId`.
 * @param ticketId
 */
  private getFirestoreUsers(ticketId: number) {
    return this.firestoreService.collection$(`tickets/${ticketId}/users`);
  }

  /** reset isExpanded object for expanding/collapsing user cards throught the pay work flow */
  resetIsExpanded() {
    for (let user of this.users) {
      this.isExpandedList[user.uid] = false;
    }
  }

  /** expand/collapse the provided user's card (used in status and waiting room pages) */
  toggleIsExpanded(user: User) {
    const isExpanded = this.getUserExpanded(user)
    this.isExpandedList[user.uid] = !isExpanded;
  }

  /** determine if the provided user's card should be expanded (used in status and waiting room) */
  getUserExpanded(user: User): boolean {
    if (!this.isExpandedList[user.uid]) {
      this.isExpandedList[user.uid] = false;
    }
    return this.isExpandedList[user.uid];
  }

  /** update the overallUsersProgress variable and the amount paid */
  updateOverallUsersProgress() {
    this.amountPaid = 0;

    let lowestStatus = this.overallUsersProgress;
    let highestStatus = this.overallUsersProgress;
    let highestStatusCount = 0;

    for (let user of this.users) {
      if (user.status === UserStatus.Paid) {
        this.amountPaid += user.totals.subtotal + user.totals.tax;
      }
      if (user.status > highestStatus) {
        if (highestStatusCount === 0) {
          highestStatus = user.status;
        } else {
          highestStatusCount = 0;
        }
      } else if (user.status < lowestStatus) {
        lowestStatus = user.status;
      }

      if (user.status === highestStatus) {
        highestStatusCount++;
      }
    }

    if (lowestStatus < this.overallUsersProgress) {
      this.overallUsersProgress = lowestStatus;
    } else if (highestStatusCount === this.users.length) {
      this.overallUsersProgress = highestStatus;
    }
    console.log('overall progress is', this.overallUsersProgress);
  }

  /** handles setting of service variables such as unclaimed items, shared items, and users */
  private updateItemsAndUsers() {
    this.unclaimedItems = [];
    this.sharedItems = [];
    this.users.forEach(u => { u.totals.subtotal = 0; u.ticketItems = [] });
    this.curUser = { ...this.users.find((user) => user.uid === this.auth.getUid()) };
    this.firestoreTicketItems.forEach((item) => {
      if (item.users.length < 1) {
        this.unclaimedItems.push(item);
      } else if (item.users.length > 1) {
        this.sharedItems.push(item);
      }

      item.users.forEach((user) => {
        const userIndex = this.users.findIndex(u => u.uid === user.uid);
        this.users[userIndex].ticketItems.push(item);
        this.users[userIndex].totals.subtotal += item.users.find(u => u.uid === user.uid).price;
      });
    });
    this.firestoreStatus$.next(true);
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
    // this.firestoreTicketItems = firestoreTicketItems.map((item: FirestoreTicketItem) =>
    //   ({ ...item, isItemOnMyTab: isItemOnMyTab(item, this.auth.getUid()), }));
    // if (this.users) {
    //   this.updateItemsAndUsers();
    // }
  }

  /**
 * Called when a Firestore document within the Firestore ticket-items collection is updated.
 * @param firestoreTicketItems
 */
  private onTicketUsersUpdate(firestoreUsers: User[]) {
    if (Object.keys(this.isExpandedList).length !== firestoreUsers.length) {
      for (let user of firestoreUsers) {
        if (!this.isExpandedList[user.uid]!) {
          this.isExpandedList[user.uid] = false;
        }
      }
    }

    this.users = firestoreUsers.map((user) => ({ ...user, ticketItems: [] }));

    if (this.firestoreTicketItems) {
      this.updateItemsAndUsers();
    }

    // this.ticketUsersDescription = getSelectItemsTicketUsersDescription(this.users);
    this.updateOverallUsersProgress();

    if (this.curUser && this.curUser.totals && this.curUser.totals.tip === 0) {
      this.curUser.totals.tip =
        Math.round(((this.userTipPercentage / 100) * this.curUser.totals.subtotal));
    }
  }

  /**
   * Called when the Firestore ticket document is updated.
   * @param firestoreTicket
   */
  private onTicketUpdate(firestoreTicket: FirestoreTicket) {
    console.log(this.firestoreTicket);
    console.log('updating the ticket', firestoreTicket)
    this.firestoreTicket = firestoreTicket;
    console.log(this.firestoreTicket);
  }
}
