import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AuthService } from '../../../services/auth/auth.service';
import { TicketService, FirestoreTicketItem } from '../../../services/ticket/ticket.service';
import { IUser } from '../../../interfaces/user.interface';


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
  hideCurUserItems: boolean = true

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public auth: AuthService,
    public ticketService: TicketService,
  ) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad WaitingRoomPage');
    this.initializeWaitingRoom();
  }

  toggleCurUserItems() {
    this.hideCurUserItems = !this.hideCurUserItems;
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
