import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AuthService } from '../../../services/auth/auth.service';
import { TicketService, UserStatus } from '../../../services/ticket/ticket.service';
import { sleep } from '../../../utilities/general.utilities';
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

  userStatus = UserStatus;
  donePaying = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public auth: AuthService,
    public alertCtrl: AlertService,
    public ticketService: TicketService,
  ) {
  }

  public ionViewCanEnter(): boolean {
    return this.auth.authenticated;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad StatusPage');

  }

  checkPaidStatus(): boolean {
    if (this.ticketService.firestoreTicket.overallUsersProgress < UserStatus.Paid) {
      return false;
    } else {
      if (!this.donePaying) {
        this.donePaying = true;
        this.viewHome();
      }
      return true;
    }
  }

  async viewHome() {
    await sleep(1500);
    const { error, response } = await this.ticketService.closeTicket();

    if (error || !response) {
      let alert = this.alertCtrl.create({
        title: 'Something went wrong',
        message: `We could not properly close out your tab, please try again.`,
        buttons: ['Ok']
      });

      alert.present();
    } else {
      await this.navCtrl.setRoot('HomePage');
      this.ticketService.clearState();
    }
  }
}
