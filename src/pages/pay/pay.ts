import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AuthService } from '../../services/auth/auth.service';
@IonicPage()
@Component({
  selector: 'page-pay',
  templateUrl: 'pay.html',
})
export class PayPage {
  @ViewChild('pay') nav!: NavController;

  constructor(public navParams: NavParams, public auth: AuthService) {}

  ionViewCanEnter() {
    return this.auth.authenticated;
  }

  ionViewDidLoad() {
    this.nav.push('LocationPage');
  }
}
