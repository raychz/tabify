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
import { user } from '../../home/example-stories';
import { TicketService, UserStatus } from '../../../services/ticket/ticket.service';
import { plurality, sleep } from '../../../utilities/general.utilities';
import { InviteOthersPage } from './invite-others/invite-others';
import { AblyTicketService } from '../../../services/ticket/ably-ticket.service';
import { TicketItem } from '../../../interfaces/ticket-item.interface';

@IonicPage()
@Component({
  selector: 'page-select-items',
  templateUrl: 'select-items.html',
})
export class SelectItemsPage {
  userUid = this.auth.getUid();

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public auth: AuthService,
    public loader: LoaderService,
    public alertCtrl: AlertService,
    public ticketService: TicketService,
    private actionSheetCtrl: ActionSheetController,
    public modalCtrl: ModalController,
    public ablyTicketService: AblyTicketService
  ) { }

  public ionViewCanEnter(): boolean {
    return this.auth.authenticated;
  }

  ionViewDidLoad() {
  }

  ionViewWillUnload() {
    this.ticketService.destroySubscriptions();
  }

  async addOrRemoveItem(item: TicketItem) {
    if (item.loading) return;
    item.loading = true;
    try {
      // Loading is set to false in `synchronizeFrontendTicketItems`
      if (item.usersMap[this.userUid]) {
        await this.ticketService.removeUserFromTicketItem(this.ablyTicketService.ticket.id, item.id);
      } else {
        await this.ticketService.addUserToTicketItem(this.ablyTicketService.ticket.id, item.id);
      }
    } catch (e) {
      console.error(e);
      item.loading = false;
      let message;
      if (e.error && e.error.message) {
        message = e.error.message;
      } else {
        // TODO: Consider reloading the ticket here
        message = `An unknown error occurred. Please try again. ${e}`
      }
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

  // TODO: Replace this function with a bulk add/remove action
  async addAllItemsToMyTab() {
    for (const item of this.ablyTicketService.ticket.items) {
      if (!item.usersMap[this.userUid]) this.addOrRemoveItem(item);
    }
  }

  // TODO: Replace this function with a bulk add/remove action
  async removeAllItemsFromMyTab() {
    for (const item of this.ablyTicketService.ticket.items) {
      if (item.usersMap[this.userUid]) await this.addOrRemoveItem(item);
    }
  }

  inviteOthers() {
    const modal = this.modalCtrl.create('InviteOthersPage', {
      tabNumber: this.ablyTicketService.ticket.ticket_number,
      users: this.ablyTicketService.ticket.users,
    });
    modal.present();
  }
}
