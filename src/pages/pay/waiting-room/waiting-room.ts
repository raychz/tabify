import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Navbar } from 'ionic-angular';
import { AuthService } from '../../../services/auth/auth.service';
import { TicketService, UserStatus } from '../../../services/ticket/ticket.service';
import { sleep } from '../../../utilities/general.utilities';
import { Platform } from 'ionic-angular';
import { AlertService } from '../../../services/utilities/alert.service';

@IonicPage()
@Component({
  selector: 'page-waiting-room',
  templateUrl: 'waiting-room.html',
})
export class WaitingRoomPage {
  @ViewChild(Navbar) navBar: Navbar;

  userStatus = UserStatus;
  moveToTaxTip = false;
  firstConfirm = true;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public auth: AuthService,
    public ticketService: TicketService,
    public platform: Platform,
    public alertCtrl: AlertService
  ) {}

  public ionViewCanEnter(): boolean {
    return this.auth.authenticated;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad WaitingRoomPage');

    if(this.ticketService.curUser.status === UserStatus.Confirmed) {
      this.firstConfirm = false;
    }
  }

  checkConfirmedStatus(): boolean {
    if (this.ticketService.overallUsersProgress < UserStatus.Confirmed || this.ticketService.unclaimedItems.length > 0) {
      return false;
    } else {
      if (!this.moveToTaxTip) {
        this.moveToTaxTip = true;
        this.viewTaxTip();
      }
      return true;
    }
  }

  async viewTaxTip() {
    await sleep(1500);
    await this.ticketService.changeUserStatus(UserStatus.Paying);
    this.navCtrl.push('TaxTipPage');
  }

  async toggleConfirm() {

    if (this.firstConfirm) {
      const alert = this.alertCtrl.create({
        title: 'Confirm that everyone has joined',
        message: `There are currently ${this.ticketService.users.length} users on this tab. Is that everyone in your party?`,
        buttons: [
          {
            text: 'No',
            role: 'cancel'
          },
          {
            text: 'Yes',
            handler: () => { this.firstConfirm = false; this.changeUserConfirmStatus() }
          }
        ]
      });
      alert.present();
    } else {
      this.changeUserConfirmStatus();
    }
  }

  async changeUserConfirmStatus () {
    if (this.ticketService.curUser.status !== UserStatus.Confirmed) {
      await this.ticketService.changeUserStatus(UserStatus.Confirmed);
    } else {
      await this.ticketService.changeUserStatus(UserStatus.Waiting);
    }

    console.log('updated users: ', this.ticketService.users);
  }

  async backButtonAction() {
    await this.ticketService.changeUserStatus(UserStatus.Selecting);
    this.ticketService.resetIsExpanded();
    this.navCtrl.pop();
  }
}
