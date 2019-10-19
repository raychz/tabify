import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { TicketService } from '../../../../services/ticket/ticket.service';
import { AuthService } from '../../../../services/auth/auth.service';

@IonicPage()
@Component({
  selector: 'page-enter-tip',
  templateUrl: 'enter-tip.html',
})
export class EnterTipPage {
  @ViewChild('tipInput') tipInput: any;
  tip: number = this.ticketService.userTipPercentage;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public ticketService: TicketService,
    public viewCtrl: ViewController,
    public auth: AuthService
  ) { }

  public ionViewCanEnter(): boolean {
    return this.auth.authenticated;
  }

  ionViewDidLoad() {
    setTimeout(() => {
      this.tipInput.setFocus();
    }, 600);
  }

  async dismiss() {
    const enteredTip = Number(this.tip);
    if (isNaN(enteredTip)) {
      this.ticketService.userTipPercentage = 18;
      this.ticketService.curUser.totals.tip =
        Math.round(((this.ticketService.userTipPercentage / 100) * this.ticketService.curUser.totals.subtotal));
    } else if (enteredTip < 0) {
      this.ticketService.userTipPercentage = 0;
      this.ticketService.curUser.totals.tip = 0;
    } else {
      this.ticketService.userTipPercentage = enteredTip;
      this.ticketService.curUser.totals.tip =
        Math.round(((this.ticketService.userTipPercentage / 100) * this.ticketService.curUser.totals.subtotal));
    }
    await this.viewCtrl.dismiss();
  }
}
