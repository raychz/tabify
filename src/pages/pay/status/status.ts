import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from '@ionic/angular';
import { AuthService } from '../../../services/auth/auth.service';
import { sleep } from '../../../utilities/general.utilities';
import { AblyTicketService } from '../../../services/ticket/ably-ticket.service';
import { TicketStatus, TicketUserStatusOrder, TicketUserStatus } from '../../../enums';
import { AlertService } from '../../../services/utilities/alert.service';

/**
 * Generated class for the StatusPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-status',
  templateUrl: 'status.html',
})
export class StatusPage {

  currentUserUid = this.auth.getUid();
  viewHome = false;

  // Expose const to template
  TicketUserStatusOrder = TicketUserStatusOrder;
  // Expose enum to template
  TicketUserStatus = TicketUserStatus;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public auth: AuthService,
    public alertCtrl: AlertService,
    public ablyTicketService: AblyTicketService,
  ) {
  }

  public ionViewCanEnter(): boolean {
    return this.auth.authenticated;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad StatusPage');

  }

  checkPaidStatus(): boolean {
    if (this.ablyTicketService.ticket && this.ablyTicketService.ticket.ticket_status === TicketStatus.OPEN) {
      return false;
    } else {
      if (!this.viewHome) {
        this.viewHome = true;
        this.viewHomePage();
      }
      return true;
    }
  }

  async viewHomePage() {
    const alert = this.alertCtrl.create({
      title: 'Success',
      message: `Thanks for visiting ${this.ablyTicketService.ticket.location!.name}! This ticket is now closed and fully paid for.`,
      buttons: ['OK']
    });
    await sleep(1500);
    // pushing the home page first avoids errors from popping up when setting root - see below comment for further explenation
    // await this.navCtrl.push('HomePage');
    // setting root unloads tab look up which clears the ably ticket service state and disconnects the ably connection
    await alert.present();
    await this.ablyTicketService.clearState();
    await this.navCtrl.setRoot('HomePage');
  }
}
