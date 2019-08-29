import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { sleep } from '../../../../utilities/general.utilities';
import { AuthService } from '../../../../services/auth/auth.service';

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

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, public auth: AuthService) {
  }

  public ionViewCanEnter(): boolean {
    return this.auth.authenticated;
  }

  async ionViewDidLoad() {
    console.log('ionViewDidLoad PayConfirmationPage');
    await sleep(1000);
    // await this.viewCtrl.dismiss();
    console.log('nav', this.navCtrl);
    // this.navCtrl.setRoot('HomePage');
    // this.app.getRootNav().setRoot('HomePage');
    // await this.navCtrl.popAll();
    await this.viewCtrl.dismiss();
  }

}
