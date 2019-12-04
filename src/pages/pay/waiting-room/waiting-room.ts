import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Navbar } from 'ionic-angular';
import { AuthService } from '../../../services/auth/auth.service';
import { TicketService, UserStatus } from '../../../services/ticket/ticket.service';
import { sleep, abbreviateName } from '../../../utilities/general.utilities';
import { Platform } from 'ionic-angular';
import { AlertService } from '../../../services/utilities/alert.service';
import { AblyTicketService } from '../../../services/ticket/ably-ticket.service';
import { TicketUserStatus, TicketUserStatusOrder } from '../../../enums';
import { LoaderService } from '../../../services/utilities/loader.service';

@IonicPage()
@Component({
  selector: 'page-waiting-room',
  templateUrl: 'waiting-room.html',
})
export class WaitingRoomPage {
  @ViewChild(Navbar) navBar: Navbar;
  moveToTaxTip = false;
  currentUserUid = this.auth.getUid();
  // Expose const to template
  TicketUserStatusOrder = TicketUserStatusOrder;
  // Expose enum to template
  TicketUserStatus = TicketUserStatus;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public auth: AuthService,
    public platform: Platform,
    public alertCtrl: AlertService,
    public ablyTicketService: AblyTicketService,
    public loader: LoaderService,
  ) { }

  public ionViewCanEnter(): boolean {
    return this.auth.authenticated;
  }

  /** Returns true if at least one item on the ticket is shared by multiple users */
  areTicketItemsShared() {
    return this.ablyTicketService.ticket.items.some(item => item.users.length > 1);
  }

  /** Returns true if at least one item on the ticket is unclaimed */
  areTicketItemsUnclaimed() {
    return this.ablyTicketService.ticket.items.some(item => item.users.length === 0);
  }

  /** Counts number of unclaimed items */
  unclaimedTicketItemsCount(): number {
    return this.ablyTicketService.ticket.items.filter(item => item.users.length === 0).length;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad WaitingRoomPage');
  }

  checkConfirmedStatus(): boolean {
    const currentUser = this.ablyTicketService.ticket.usersMap.get(this.currentUserUid);
    if (currentUser.status === TicketUserStatus.PAYING) {
      if (!this.moveToTaxTip) {
        this.moveToTaxTip = true;
        this.viewTaxTip();
      }
      return true;
    }
    return false;
  }

  async viewTaxTip() {
    await sleep(1500);
    this.navCtrl.push('TaxTipPage');
  }

  async changeUserConfirmStatus() {
    const currentUser = this.ablyTicketService.ticket.usersMap.get(this.currentUserUid);
    if (currentUser.status === TicketUserStatus.WAITING) {
      const alert = this.alertCtrl.create({
        title: 'Is the party complete?',
        message: `There are currently ${this.ablyTicketService.ticket.users.length} users on this tab. Is that everyone?`,
        buttons: [
          {
            text: 'No',
            role: 'cancel'
          },
          {
            text: 'Yes',
            handler: () => { this.setTicketUserStatus(this.ablyTicketService.ticket.id, currentUser.id, TicketUserStatus.CONFIRMED); }
          }
        ]
      });
      alert.present();
    } else if (currentUser.status === TicketUserStatus.CONFIRMED) {
      await this.setTicketUserStatus(this.ablyTicketService.ticket.id, currentUser.id, TicketUserStatus.WAITING);
    } else {
      throw `The current user status is invalid: ${this.ablyTicketService.ticket.usersMap.get(this.currentUserUid).status}`;
    }
  }

  async setTicketUserStatus(ticketId: number, ticketUserId: number, status: TicketUserStatus) {
    const currentUser = this.ablyTicketService.ticket.usersMap.get(this.currentUserUid);
    const loading = this.loader.create();
    await loading.present();
    try {
      await this.ablyTicketService.setTicketUserStatus(this.ablyTicketService.ticket.id, currentUser.id, status);
    } catch (e) {
      console.log(e);
      if (e && e.error && e.error.message) {
        const alert = this.alertCtrl.create({
          title: 'Warning',
          message: e.error.message,
          buttons: ['Ok']
        });
        alert.present();
      } else {
        const alert = this.alertCtrl.create({
          title: 'Unknown Error',
          message: 'Sorry! Try refreshing the app and joining the tab again.',
          buttons: ['Ok']
        });
        alert.present();
      }
    }
    await loading.dismiss();
  }

  isBackButtonDisabled() {
    const allConfirmed = this.ablyTicketService.ticket.users.every(u => TicketUserStatusOrder[u.status] >= TicketUserStatusOrder[TicketUserStatus.CONFIRMED]);
    return allConfirmed && !this.areTicketItemsUnclaimed();
  }

  async backButtonAction() {
    const currentUser = this.ablyTicketService.ticket.usersMap.get(this.currentUserUid);
    if (!this.isBackButtonDisabled()) {
      await this.ablyTicketService.setTicketUserStatus(this.ablyTicketService.ticket.id, currentUser.id, TicketUserStatus.SELECTING);
      this.navCtrl.pop();
    }
  }
}
