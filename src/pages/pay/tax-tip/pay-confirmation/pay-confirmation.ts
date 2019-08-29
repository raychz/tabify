import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { sleep } from '../../../../utilities/general.utilities';

/**
 * Generated class for the PayConfirmationPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-pay-confirmation',
  templateUrl: 'pay-confirmation.html',
})
export class PayConfirmationPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController) {
  }

  async ionViewDidLoad() {
    console.log('ionViewDidLoad PayConfirmationPage');
    await sleep(3000);
    // const parentNav: NavController = this.navCtrl.parent;
    // parentNav.setRoot(
    //   'HomePage',
    //   {},
    //   { animate: true, animation: 'md-transition', direction: 'back' }
    // );
    // this.navCtrl.setRoot('HomePage');
    await this.viewCtrl.dismiss();
  }

}
