import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { TicketService } from '../../../../services/ticket/ticket.service';

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
    public viewCtrl: ViewController, ) {
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
    } else if (enteredTip < 0) {
      this.ticketService.userTipPercentage = 0;
    } else {
      this.ticketService.userTipPercentage = enteredTip;
    }
    await this.viewCtrl.dismiss();
  }
}
