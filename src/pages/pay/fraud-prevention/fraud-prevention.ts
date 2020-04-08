import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { AuthService } from '../../../services/auth/auth.service';
import { AblyTicketService } from '../../../services/ticket/ably-ticket.service';

@IonicPage()
@Component({
  selector: 'page-fraud-prevention',
  templateUrl: 'fraud-prevention.html',
})
export class FraudPreventionPage {
  dateTime: number = Date.now();

  constructor(
    public viewCtrl: ViewController,
    public auth: AuthService,
    public ablyTicketService: AblyTicketService,
  ) { }

  public ionViewCanEnter(): boolean {
    return this.auth.authenticated;
  }

  ionViewDidLoad() {
    this.getDateTime();
  }

  ionViewDidUnload() {
    clearInterval(this.dateTime)
  }

  getDateTime() {
    setInterval(() => {
      this.dateTime = Date.now();
    }, 1000);
  }

  async dismiss() {
    await this.viewCtrl.dismiss();
  }
}
