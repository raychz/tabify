import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Navbar } from 'ionic-angular';
import { AuthService } from '../../../services/auth/auth.service';
import { TicketService, UserStatus, User } from '../../../services/ticket/ticket.service';
import { IUser } from '../../../interfaces/user.interface';
import { sleep } from '../../../utilities/general.utilities';

/**
 * Generated class for the WaitingRoomPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-waiting-room',
  templateUrl: 'waiting-room.html',
})
export class WaitingRoomPage {
  @ViewChild(Navbar) navBar!: Navbar;

  userStatus = UserStatus;
  moveToTaxTip = false;
  selectConfirmButton = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public auth: AuthService,
    public ticketService: TicketService,
  ) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad WaitingRoomPage');
    this.initializeWaitingRoom();
    this.setBackButtonAction();
  }

  checkConfirmedStatus(): boolean {
    if (this.ticketService.firestoreTicket.overallUsersProgress < UserStatus.Confirmed || this.ticketService.unclaimedItems.length > 0) {
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
    this.ticketService.changeUserStatus(UserStatus.Paying);
    this.navCtrl.push('TaxTipPage');
  }

  async toggleConfirm() {
    this.selectConfirmButton = !this.selectConfirmButton;
    if (this.selectConfirmButton) {
      await this.ticketService.changeUserStatus(UserStatus.Confirmed);
    } else {
      await this.ticketService.changeUserStatus(UserStatus.Waiting);
    }

    console.log('updated users: ', this.ticketService.users);
  }

  setBackButtonAction() {
    this.navBar.backButtonClick = () => {
      this.ticketService.changeUserStatus(UserStatus.Selecting);
      this.ticketService.resetIsExpanded();
      this.navCtrl.pop();
      if (this.navParams.get('pushSelectItemsOnBack')) {
        this.navCtrl.push('SelectItemsPage');
      }
    }
  }

  initializeWaitingRoom() {
    console.log(this.ticketService.firestoreTicket);
    const confirmed = this.navParams.get('confirmed');
    if (confirmed) {
      this.selectConfirmButton = confirmed;
    }
  }
}
