import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { PaymentService } from '../../../../services/payment/payment.service';
import { TicketService } from '../../../../services/ticket/ticket.service';
import { PaymentDetailsPageMode } from '../../../payment-methods/payment-details/payment-details';
import { sleep } from '../../../../utilities/general.utilities';
import { AuthService } from '../../../../services/auth/auth.service';

@IonicPage()
@Component({
  selector: 'page-select-payment',
  templateUrl: 'select-payment.html',
})
export class SelectPaymentPage {
  canSelect = true;
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public paymentService: PaymentService,
    public ticketService: TicketService,
    public auth: AuthService
  ) { }

  public ionViewCanEnter(): boolean {
    return this.auth.authenticated;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SelectPaymentPage');
  }

  addACard() {
    this.navCtrl.push('PaymentDetailsPage', {
      mode: PaymentDetailsPageMode.SAVE_AND_PAY,
      title: 'Add a Card'
    });
  }

  async selectPaymentMethod(method: any) {
    // Pop back to Checkout page and disable the other radio options
    this.canSelect = false;
    // Sleep for more pleasant UX after selecting payment method
    await sleep(300);
    await this.navCtrl.pop();
  }
}
