import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {PaymentDetailsPageMode} from "./payment-details/payment-details";
import { AuthService } from '../../services/auth/auth.service';

@IonicPage()
@Component({
  selector: 'page-payment-methods',
  templateUrl: 'payment-methods.html',
})
export class PaymentMethodsPage {
  mode: PaymentDetailsPageMode;

  constructor(public navCtrl: NavController, public navParams: NavParams, public auth: AuthService) {
    this.mode = navParams.get('mode');
  }

  public ionViewCanEnter(): boolean {
    return this.auth.authenticated;
  }

  ionViewDidLoad() {}

  addNewCard() {
    this.navCtrl.push('PaymentDetailsPage', {
      title: 'Add New Card',
      mode: this.mode
    });
  }
}
