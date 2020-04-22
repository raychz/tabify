import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from '@ionic/angular';
import { TicketService } from '../../../../services/ticket/ticket.service';
import { AuthService } from '../../../../services/auth/auth.service';
import { AblyTicketService } from '../../../../services/ticket/ably-ticket.service';

@IonicPage()
@Component({
  selector: 'page-enter-tip',
  templateUrl: 'enter-tip.html',
})
export class EnterTipPage {
  @ViewChild('tipInput') tipInput: any;
  tipPercentage: number = this.ablyTicketService.ticket.usersMap.get(this.auth.getUid()).tipPercentage;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    public auth: AuthService,
    public ablyTicketService: AblyTicketService,
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
    const enteredTip = Number(this.tipPercentage);
    const currentUser = this.ablyTicketService.ticket.usersMap.get(this.auth.getUid());
    if (isNaN(enteredTip)) {
      currentUser.tipPercentage = 20;
      currentUser.tips =
        Math.round(((currentUser.tipPercentage / 100) * currentUser.items));
    } else if (enteredTip < 0) {
      currentUser.tipPercentage = 0;
      currentUser.tips = 0;
    } else {
      currentUser.tipPercentage = enteredTip;
      currentUser.tips =
        Math.round(((currentUser.tipPercentage / 100) * currentUser.items));
    }
    await this.viewCtrl.dismiss();
  }
}
