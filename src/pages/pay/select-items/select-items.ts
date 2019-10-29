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
import { TicketService, UserStatus } from '../../../services/ticket/ticket.service';
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

  async viewWaitingRoom() {
    await this.ticketService.changeUserStatus(UserStatus.Waiting);
    this.navCtrl.push('WaitingRoomPage');
  }

  async confirmSelections() {
    const loading = this.loader.create();
    await loading.present();
    if (this.ticketService.curUser.ticketItems.length) {
      this.viewWaitingRoom();
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
    await loading.dismiss();
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

  inviteOthers() {
    const modal = this.modalCtrl.create('InviteOthersPage', {
      tabNumber: this.ticketService.firestoreTicket.tab_id,
      users: this.ticketService.users,
    });
    modal.present();
  }
}
