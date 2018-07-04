import { Component } from '@angular/core';
import {
  IonicPage,
  NavController,
  NavParams,
  ViewController,
} from 'ionic-angular';

/**
 * Generated class for the LocationPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-location',
  templateUrl: 'location.html',
})
export class LocationPage {
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController
  ) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad LocationPage');
  }

  cancel() {
    const parentNav: NavController = this.navCtrl.parent;
    parentNav.setRoot(
      'HomePage',
      {},
      { animate: true, animation: 'md-transition', direction: 'back' }
    );
  }

  next() {
    this.navCtrl.push('TabLookupPage');
  }
}
