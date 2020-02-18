import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { DecimalPipe } from '@angular/common';
import { TicketService } from '../../../../services/ticket/ticket.service';
import { AuthService } from '../../../../services/auth/auth.service';
import { AblyTicketService } from '../../../../services/ticket/ably-ticket.service';
import { TicketUser } from '../../../../interfaces/ticket-user.interface';

export enum TipSegment {
  PERCENT = 'PERCENT',
  DOLLAR = 'DOLLAR'
}

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
  default15: number = Math.round(0.15 * this.curUser.items) / 100;
  default20: number = Math.round(0.2 * this.curUser.items) / 100;
  default25: number = Math.round(0.25 * this.curUser.items) / 100;
  // expose enum to template
  tipSegmentEnum = TipSegment;
  tipSegment = this.tipSegmentEnum.PERCENT

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

  swipeEvent($e: {deltaX: number}) {
    if ($e.deltaX > 0) {
      // swipe left to right
      this.tipSegment = this.tipSegmentEnum.PERCENT;
    } else {
      // swipe right to left
      this.tipSegment = this.tipSegmentEnum.DOLLAR;
    }
}

  formatDollar(value: number) {
    this.tipInputDollar.value = this.decimalPipe.transform(value, '1.2-2');
  }

  formatPercent(value: number) {
    this.tipInputPercent.value = value;
  }

  dollarInput(event: {value: number}) {
    this.tipDollar = event.value;
    this.tipPercentage = Math.round(((event.value * 100) / this.curUser.items) * 100);
    this.formatDollar(event.value);
    this.formatPercent(this.tipPercentage);
  }

  percentInput(event: {value: number}) {
    console.log(event.value)
    this.tipPercentage = event.value;
    this.tipDollar = Math.round((event.value / 100) * this.curUser.items) / 100;
    this.formatPercent(event.value);
    this.formatDollar(this.tipDollar);
  }

  selectDefaultValue(dollarValue: number) {
    this.tipDollar = dollarValue
    if (dollarValue === this.default15) {
      this.tipPercentage = 15;
    } else if (dollarValue === this.default20) {
      this.tipPercentage = 20;
    } else if (dollarValue === this.default25) {
      this.tipPercentage = 25;
    }
    this.dismiss(true)
  }

  async dismiss(forceDefault: boolean=false) {
    let enteredTipDollar = this.tipDollar * 100;
    let enteredTipPercent = this.tipPercentage;
    if (!forceDefault) {
      if (this.tipSegment == this.tipSegmentEnum.PERCENT) {
        if (isNaN(enteredTipPercent)) {
          enteredTipPercent = 20;
          enteredTipDollar = this.default20;
        } else if (enteredTipPercent < 0) {
          enteredTipPercent = 0;
          enteredTipDollar = 0;
        }
      } else if (this.tipSegment == this.tipSegmentEnum.DOLLAR) {
        if (isNaN(enteredTipDollar)) {
          enteredTipPercent = 20;
          enteredTipDollar = this.default20;
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
