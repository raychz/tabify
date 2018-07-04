import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-pay',
  templateUrl: 'pay.html',
})
export class PayPage {
  @ViewChild('pay') nav: NavController;

  constructor(public navParams: NavParams) {}

  ionViewDidLoad() {
    this.nav.push('LocationPage');
  }
}
