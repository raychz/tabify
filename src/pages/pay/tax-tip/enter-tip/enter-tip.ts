import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { DecimalPipe } from '@angular/common';
import { TicketService } from '../../../../services/ticket/ticket.service';
import { AuthService } from '../../../../services/auth/auth.service';
import { AblyTicketService } from '../../../../services/ticket/ably-ticket.service';
import { TicketUser } from '../../../../interfaces/ticket-user.interface';

@IonicPage()
@Component({
  selector: 'page-enter-tip',
  templateUrl: 'enter-tip.html',
})
export class EnterTipPage {
  @ViewChild('tipInputPercent') tipInputPercent: any;
  @ViewChild('tipInputDollar') tipInputDollar: any;
  tipPercentage: number;
  tipDollar: number;
  curUser: TicketUser = this.ablyTicketService.ticket.usersMap.get(this.auth.getUid());
  default_15: number = Math.round(0.15 * this.curUser.items) / 100
  default_20: number = Math.round(0.2 * this.curUser.items) / 100
  default_25: number = Math.round(0.25 * this.curUser.items) / 100
  tipSegement = 'percent'

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    public auth: AuthService,
    public decimalPipe: DecimalPipe,
    public ablyTicketService: AblyTicketService,
  ) { }

  public ionViewCanEnter(): boolean {
    return this.auth.authenticated;
  }

  public ionViewDidLoad() {
    this.percentInput({value: this.curUser.tipPercentage});
  }

  formatDollar(value: number) {
    return Number(this.decimalPipe.transform(value, '1.2-2'));
  }

  dollarInput(event: {value: number}) {
    const dollar = this.formatDollar(event.value);
    this.tipDollar = dollar;
    this.tipPercentage = Math.round(((dollar * 100) / this.curUser.items) * 100)
  }

  percentInput(event: {value: number}) {
    this.tipPercentage = event.value;
    this.tipDollar = Math.round((event.value / 100) * this.curUser.items) / 100
  }

  selectDefaultValue(dollar_value: number) {
    this.tipDollar = dollar_value
    if (dollar_value === this.default_15) {
      this.tipPercentage = 15;
    } else if (dollar_value === this.default_20) {
      this.tipPercentage = 20;
    } else if (dollar_value === this.default_25) {
      this.tipPercentage = 25;
    }
    this.dismiss(true)
  }

  async dismiss(forceDefault: boolean=false) {
    let enteredTipDollar = this.tipDollar * 100;
    let enteredTipPercent = this.tipPercentage;
    if (!forceDefault) {
      if (this.tipSegement == 'percent') {
        if (isNaN(enteredTipPercent)) {
          enteredTipPercent = 20;
          enteredTipDollar = this.default_20;
        } else if (enteredTipPercent < 0) {
          enteredTipPercent = 0;
          enteredTipDollar = 0;
        }
      } else if (this.tipSegement == 'dollar') {
        if (isNaN(enteredTipDollar)) {
          enteredTipPercent = 20;
          enteredTipDollar = this.default_20;
        }
        else if (enteredTipDollar < 0) {
          enteredTipDollar = 0
          enteredTipPercent = 0
        }
      }
    }
    this.curUser.tipPercentage = enteredTipPercent;
    this.curUser.tips = enteredTipDollar;

    await this.viewCtrl.dismiss();
  }
}
