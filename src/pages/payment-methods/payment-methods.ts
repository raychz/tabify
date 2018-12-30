import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {PaymentDetailsPageMode} from "./payment-details/payment-details";

@IonicPage()
@Component({
  selector: 'page-payment-methods',
  templateUrl: 'payment-methods.html',
})
export class PaymentMethodsPage {
  mode: PaymentDetailsPageMode;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.mode = navParams.get('mode');
  }

  ionViewDidLoad() {}

  addNewCard() {
    this.navCtrl.push('PaymentDetailsPage', {
      title: 'Add New Card',
      mode: this.mode
    });
  }
}
