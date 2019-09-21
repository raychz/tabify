import { Component, ChangeDetectionStrategy } from '@angular/core';
import {
  IonicPage,
  NavController,
  NavParams,
  ActionSheetController,
  ModalController,
} from 'ionic-angular';
import currency from 'currency.js';
import { AuthService } from '../../../services/auth/auth.service';
import { LoaderService } from '../../../services/utilities/loader.service';
import { AlertService } from '../../../services/utilities/alert.service';
import { ITicket } from '../../../interfaces/ticket.interface';
import { ITicketItem } from '../../../interfaces/ticket-item.interface';
import { user } from '../../home/example-stories';
import { TicketService } from '../../../services/ticket/ticket.service';
import { plurality } from '../../../utilities/general.utilities';
import { InviteOthersPage } from './invite-others/invite-others';

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

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public auth: AuthService,
    public loader: LoaderService,
    public alertCtrl: AlertService,
    public ticketService: TicketService,
    private actionSheetCtrl: ActionSheetController,
    public modalCtrl: ModalController,
  ) { }

  public ionViewCanEnter(): boolean {
    return this.auth.authenticated;
  }

  ionViewDidLoad() {
  }

  ionViewWillUnload() {
    this.ticketService.destroySubscriptions();
  }

  async addOrRemoveItem(item: any) {
    if (item.loading) return;
    if (item.isItemOnMyTab) {
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

  findMyShare(item: any) {
    const share = item.users.find(
      (user: { uid: string | null }) => user.uid === this.auth.getUid()
    ).price;
    return share || 0;
  }

  async removeItemFromMyTab(item: any) {
    item.loading = true;
    const {
      success,
      message,
    } = await this.ticketService.removeUserFromFirestoreTicketItem(
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

  async viewTaxAndTip() {
    this.navCtrl.push('TaxTipPage');
  }

  async confirmSelections() {
    if (this.ticketService.userSelectedItemsCount) {
      const confirm = this.alertCtrl.create({
        title: 'Confirm Selections',
        message: `You've added ${this.ticketService.userSelectedItemsCount} item${plurality(this.ticketService.userSelectedItemsCount)} to your tab. Is this correct?`,
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

  presentActionSheet() {
    const actionSheet = this.actionSheetCtrl.create({
      title: 'Modify your tab',
      buttons: [
        {
          text: 'Add all to my tab',
          handler: () => {
            this.addAllItemsToMyTab();
          },
        },
        {
          text: 'Remove all from my tab',
          role: 'destructive',
          handler: () => {
            this.removeAllItemsFromMyTab();
          },
        },
        {
          text: 'Cancel',
          role: 'cancel',
        },
      ],
    });
    actionSheet.present();
  }

  async addAllItemsToMyTab() {
    return this.ticketService.firestoreTicketItems.forEach(async item => {
      if (!item.isItemOnMyTab) await this.addItemToMyTab(item);
    });
  }

  async removeAllItemsFromMyTab() {
    return this.ticketService.firestoreTicketItems.forEach(async item => {
      if (item.isItemOnMyTab) await this.removeItemFromMyTab(item);
    });
  }

  getName(name: string) {
    if (name.toLowerCase().includes('taco')) {
      return `🌮 ${name}`;
    } else if (name.toLowerCase().includes('pizza')) {
      return `🍕 ${name}`;
    }
    return name;
  }

  inviteOthers() {
    const modal = this.modalCtrl.create('InviteOthersPage', {
      tabNumber: this.ticketService.firestoreTicket.tab_id,
      users: this.ticketService.firestoreTicket.users,
    });
    modal.present();
  }
}
