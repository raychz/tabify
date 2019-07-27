import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { PaymentDetailsPageMode } from "./payment-details/payment-details";
import { PaymentService } from '../../services/payment/payment.service';

@IonicPage()
@Component({
  selector: 'page-payment-methods',
  templateUrl: 'payment-methods.html',
})
export class PaymentMethodsPage {
  mode: PaymentDetailsPageMode;

  constructor(public navCtrl: NavController, public navParams: NavParams, public paymentService: PaymentService) {
    this.mode = navParams.get('mode');
  }

  async ionViewDidLoad() {
    await this.paymentService.initializePaymentMethods();
  }

  addNewCard() {
    this.navCtrl.push('PaymentDetailsPage', {
      title: 'Add New Card',
      mode: this.mode
    });
  }
}
