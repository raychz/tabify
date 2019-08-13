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
  user!: IUser
  payers!: IUser[];
  sharedItems!: FirestoreTicketItem[];
  unclaimedItems!: FirestoreTicketItem[];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public auth: AuthService,
    public ticketService: TicketService,
  ) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad WaitingRoomPage');
    this.initializeItems();
  }

  initializeItems() {
    this.user.picture = this.auth.getPhotoUrl() as string;
    this.user.name = this.auth.getDisplayName();
    this.user.status = 'waiting';
    this.user.subtotal = this.ticketService.userSubtotal;


    this.ticketService.firestoreTicketItems.forEach( (item) => {
      if (item.users.length === 0) {
        this.unclaimedItems.push(item);
      } else if (item.users.length > 1) {
        this.sharedItems.push(item);
      }

      item.users.forEach( (user) => {
        if (user.uid === this.auth.getUid()) {
          this.user.items.push(item);
        } else {

        }
      });
    });
  }

  viewTaxAndTip() {
    this.navCtrl.push('TaxTipPage');
  }

}
