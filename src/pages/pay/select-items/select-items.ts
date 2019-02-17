import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import currency from 'currency.js';
import { AuthService } from '../../../services/auth/auth.service';
import { LoaderService } from '../../../services/utilities/loader.service';
import { AlertService } from '../../../services/utilities/alert.service';
import { SocketService } from '../../../services/socket/socket.service';
import { ITicket } from '../../../interfaces/ticket.interface';
import { ITicketItem } from '../../../interfaces/ticket-item.interface';
import { FirestoreService } from '../../../services/firestore/firestore.service';
import { tap } from 'rxjs/operators';
import { user } from '../../home/example-stories';
import { TicketService } from '../../../services/ticket/ticket.service';
import { Observable } from 'rxjs';
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
  // receiptItems: ITicketItem[] = [];
  ticket: ITicket = this.navParams.data;
  firestoreTicket!: any;
  firestoreTicketItems!: any;

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
    this.firestoreTicket = this.ticketService.getFirestoreTicket(
      this.ticket.id
    );
    this.firestoreTicketItems = this.ticketService.getFirestoreTicketItems(
      this.ticket.id
    );
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

  countItemsOnMyTab() {
    //   let count = 0;
    //   this.receiptItems.forEach(item => (count += ~~this.isItemOnMyTab(item)));
    //   return count;
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

  updateSubTotal() {
    //   let sum = currency(0);
    //   this.receiptItems.forEach(item => {
    //     const payer = item.payers.find(e => e.uid === this.auth.getUid());
    //     if (payer) {
    //       sum = sum.add(payer.price);
    //     }
    //   });
    //   return sum.format(false);
  }

  filterItems(ev: any) {
    //   const { value } = ev.target;
    //   if (value && value.trim() !== '') {
    //     this.receiptItems.forEach(item => {
    //       item.isHidden = !(
    //         item.name.toLowerCase().indexOf(value.toLowerCase()) > -1
    //       );
    //     });
    //   } else {
    //     this.receiptItems.forEach(item => (item.isHidden = false));
    //   }
  }

  viewTaxAndTip() {
    //   this.loader
    //     .present({
    //       content:
    //         'Waiting on Alice, Bob, and John to finish making selections...',
    //     })
    //     .then(() => {
    //       setTimeout(() => {
    //         this.loader.setContent(
    //           'Waiting on Bob to finish making selections...'
    //         );
    //       }, 1500);
    //     });
    //   setTimeout(() => {
    //     this.loader.dismiss();
    //     this.navCtrl.push('TaxTipPage', {
    //       ...this.tab,
    //       receiptItems: this.receiptItems,
    //     });
    //   }, 3500);
  }

  confirmSelections() {
    //   const itemCount = this.countItemsOnMyTab();
    //   if (itemCount) {
    //     const confirm = this.alertCtrl.create({
    //       title: 'Confirm Selections',
    //       message: `You've added ${itemCount} items to your tab. Is this correct?`,
    //       buttons: [
    //         {
    //           text: 'No',
    //           handler: () => {
    //             console.log('Cancel clicked');
    //           },
    //         },
    //         {
    //           text: 'Yes',
    //           handler: () => {
    //             confirm.dismiss().then(() => {
    //               this.viewTaxAndTip();
    //             });
    //             return false;
    //           },
    //         },
    //       ],
    //     });
    //     confirm.present();
    //   } else {
    //     const warning = this.alertCtrl.create({
    //       title: 'Warning',
    //       message: `Please add 1 or more items to your tab before continuing.`,
    //       buttons: [
    //         {
    //           text: 'Ok',
    //           handler: () => {
    //             console.log('Ok clicked');
    //           },
    //         },
    //       ],
    //     });
    //     warning.present();
    //   }
  }

  allItemsAreHidden() {
    // return this.receiptItems.every(item => !!item.isHidden );
  }
}
