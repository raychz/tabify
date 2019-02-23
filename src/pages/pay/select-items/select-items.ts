import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import currency from 'currency.js';
import { AuthService } from '../../../services/auth/auth.service';
import { LoaderService } from '../../../services/utilities/loader.service';
import { AlertService } from '../../../services/utilities/alert.service';
import { SocketService } from '../../../services/socket/socket.service';
import { ITicket } from '../../../interfaces/ticket.interface';
import { ITicketItem } from '../../../interfaces/ticket-item.interface';
import { tap, catchError } from 'rxjs/operators';
import { user } from '../../home/example-stories';
import { TicketService } from '../../../services/ticket/ticket.service';
import { of } from 'rxjs';
import { abbreviateName } from '../../../utilities/utils';

export interface ReceiptItem {
  id: number;
  name: string;
  price: number;
  payers: {
    uid?: string | null;
    firstName: string;
    price: number;
  }[];
  payersDescription?: string;
  isHidden?: boolean;
}

@IonicPage()
@Component({
  selector: 'page-select-items',
  templateUrl: 'select-items.html',
})
export class SelectItemsPage {
  ticket: ITicket = this.navParams.data;
  firestoreTicket$!: any;
  firestoreTicketItems$!: any;

  firestoreTicket!: any;
  firestoreTicketItems!: any[];
  subtotal: any;
  hasInitializationError: boolean = false;
  mySelectedItemsCount: number = 0;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public auth: AuthService,
    public socketService: SocketService,
    public loader: LoaderService,
    public alertCtrl: AlertService,
    public ticketService: TicketService
  ) {}

  ionViewDidLoad() {
    this.initializeTicket();
  }

  ionViewWillUnload() {
    console.log('Unloading');
    // this.socketService.disconnect()
  }

  getUsers(users: any[]) {
    if (!users) return 'No users on this tab.';

    const abbreviatedNames = users.map(user => abbreviateName(user.name));

    const userDisplayLimit = 3;
    if (abbreviatedNames.length > userDisplayLimit) {
      const overflowNames = abbreviatedNames.splice(userDisplayLimit);
      const others = `+${overflowNames.length} other${
        overflowNames.length > 1 ? 's' : ''
      }`;
      const othersContainer = `<span class='plus-others'>${others}</span>`;
      return `${abbreviatedNames.join(', ')} ${othersContainer}`;
    }
    return abbreviatedNames.join(', ');
  }

  initializeTicket() {
    this.firestoreTicket$ = this.ticketService
      .getFirestoreTicket(this.ticket.id)
      .pipe(
        catchError(message => this.handleInitializationError(message)),
        tap(ticket => this.onTicketUpdate(ticket))
      );

    this.firestoreTicketItems$ = this.ticketService
      .getFirestoreTicketItems(this.ticket.id)
      .pipe(
        catchError(message => this.handleInitializationError(message)),
        tap(items => this.onTicketItemsUpdate(items))
      );
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
      await this.navCtrl.popTo('TabLookupPage');
    }
    return of(error);
  }

  onTicketItemsUpdate(items: any) {
    this.firestoreTicketItems = items;
    this.updateSubTotal(items);
    this.countItemsOnMyTab();
  }

  onTicketUpdate(ticket: any) {
    this.firestoreTicket = ticket;
    this.countItemsOnMyTab();
  }

  async addOrRemoveItem(item: any) {
    if (item.loading) return;
    if (this.isItemOnMyTab(item)) {
      this.removeItemFromMyTab(item);
    } else {
      this.addItemToMyTab(item);
    }
  }

  async addItemToMyTab(item: any) {
    item.loading = true;
    const {
      success,
      message,
    } = await this.ticketService.addUserToFirestoreTicketItem(
      this.ticket.id,
      item.id
    );
    item.loading = false;
    if (!success) {
      const error = this.alertCtrl.create({
        title: 'Error',
        message,
        buttons: [
          {
            text: 'Ok',
          },
        ],
      });
      error.present();
    }
  }

  isItemOnMyTab(item: any) {
    return !!item.users.find(
      (e: { uid: string | null }) => e.uid === this.auth.getUid()
    );
  }

  findMyShare(item: any) {
    const share = item.users.find(
      (user: { uid: string | null }) => user.uid === this.auth.getUid()
    ).price;
    return share || 0;
  }

  countItemsOnMyTab(): number {
    console.log('counted items!');
    const myItems =
      this.firestoreTicketItems &&
      this.firestoreTicketItems.filter((item: any) => this.isItemOnMyTab(item));
    this.mySelectedItemsCount = (myItems && myItems.length) || 0;
    return this.mySelectedItemsCount;
  }

  async removeItemFromMyTab(item: any) {
    item.loading = true;
    const {
      success,
      message,
    } = await this.ticketService.removeUserFromFirestoreTicketItem(
      this.ticket.id,
      item.id
    );
    item.loading = false;
    if (!success) {
      const error = this.alertCtrl.create({
        title: 'Error',
        message,
        buttons: [
          {
            text: 'Ok',
          },
        ],
      });
      error.present();
    }
  }

  updateSubTotal(items: any[]) {
    let sum = 0;
    items &&
      items.forEach(item => {
        const payer = item.users.find(
          (e: { uid: string | null }) => e.uid === this.auth.getUid()
        );
        if (payer) {
          sum += payer.price;
        }
      });
    this.subtotal = sum;
  }

  async viewTaxAndTip() {
    await this.loader.present({
      content: 'Waiting on Alice, Bob, and John to finish making selections...',
    });
    setTimeout(() => {
      this.loader.setContent('Waiting on Bob to finish making selections...');
    }, 1500);
    setTimeout(() => {
      this.loader.dismiss();
      this.navCtrl.push('TaxTipPage');
    }, 3500);
  }

  async confirmSelections() {
    const itemCount = this.countItemsOnMyTab();
    if (itemCount) {
      const confirm = this.alertCtrl.create({
        title: 'Confirm Selections',
        message: `You've added ${itemCount} items to your tab. Is this correct?`,
        buttons: [
          {
            text: 'No',
            handler: () => {
              console.log('Cancel clicked');
            },
          },
          {
            text: 'Yes',
            handler: () => {
              confirm.dismiss().then(() => {
                this.viewTaxAndTip();
              });
              return false;
            },
          },
        ],
      });
      confirm.present();
    } else {
      const warning = this.alertCtrl.create({
        title: 'Warning',
        message: `Please add 1 or more items to your tab before continuing.`,
        buttons: [
          {
            text: 'Ok',
            handler: () => {
              console.log('Ok clicked');
            },
          },
        ],
      });
      warning.present();
    }
  }
}
