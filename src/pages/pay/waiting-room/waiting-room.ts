import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Navbar } from 'ionic-angular';
import { AuthService } from '../../../services/auth/auth.service';
import { TicketService, UserStatus } from '../../../services/ticket/ticket.service';
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
    if (this.ticketService.firestoreTicket.overallUsersProgress === UserStatus.Waiting || this.ticketService.unclaimedItems.length > 0) {
      return false;
    } else {
      if (!this.moveToTaxTip) {
        this.moveToTaxTip = true;
        this.viewTaxAndTip();
      }
      return true;
    }
  }

  async viewTaxTip(): Promise<boolean> {
    await sleep(6000000);
    this.navCtrl.push('TabLookupPage');
    return true;
  }

  toggleConfirm() {
    this.selectConfirmButton = !this.selectConfirmButton;
    if (this.selectConfirmButton) {
      this.ticketService.changeUserStatus(UserStatus.Confirmed);
    } else {
      this.ticketService.changeUserStatus(UserStatus.Waiting);
    }
  }

  setBackButtonAction() {
    this.navBar.backButtonClick = () => {
      this.ticketService.changeUserStatus(UserStatus.Selecting);
      this.navCtrl.pop();
    }
  }

  initializeWaitingRoom() {
    const curUser = this.ticketService.firestoreTicket.users.find( user => user.uid === this.auth.getUid() );
    console.log(curUser);
    console.log(this.ticketService.firestoreTicket);
  }

  viewTaxAndTip() {
    this.navCtrl.push('TaxTipPage');
  }
}
