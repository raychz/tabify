import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AuthService } from '../../../services/auth/auth.service';
import { TicketService } from '../../../services/ticket/ticket.service';


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
  user: any;
  payers: any;
  sharedItems: any;
  unclaimedItems: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public auth: AuthService,
    public ticketService: TicketService,
  ) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad WaitingRoomPage');
    this.initializePayers();
  }

  initializePayers() {

  }

  viewTaxAndTip() {
    this.navCtrl.push('TaxTipPage');
  }

}
