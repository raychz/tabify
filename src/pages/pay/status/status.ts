import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AuthService } from '../../../services/auth/auth.service';
import { TicketService, UserStatus } from '../../../services/ticket/ticket.service';
import { sleep } from '../../../utilities/general.utilities';
import { AlertService } from '../../../services/utilities/alert.service';
import { ThrowStmt } from '@angular/compiler';

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
    if (this.ticketService.overallUsersProgress < UserStatus.Paid) {
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
    await this.navCtrl.setRoot('HomePage');
    this.ticketService.clearState();
    const alert = this.alertCtrl.create({
      title: 'Success',
      message: `Thanks for visiting ${this.ticketService.ticket.location!.name}! This ticket is now closed and fully paid for.`,
      buttons: ['Ok']
    });
    alert.present();
  }
}
