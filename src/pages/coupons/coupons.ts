import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { AuthService } from '../../services/auth/auth.service';
import { LoaderService } from '../../services/utilities/loader.service';
import { CouponService } from '../../services/coupon/coupon.service';

@IonicPage()
@Component({
  selector: 'page-coupons',
  templateUrl: 'coupons.html',
})
export class CouponsPage {

  coupons: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public couponService: CouponService,
    public auth: AuthService,
    public alertCtrl: AlertController,
    public loader: LoaderService,
  ) {}

  public ionViewCanEnter(): boolean {
    return this.auth.authenticated;
  }

  async ionViewDidLoad() {
    console.log('ionViewDidLoad CouponsPage');
    await this.getCoupons();
  }

  async getCoupons() {
    const loading = this.loader.create();
    await loading.present();
    try {
      this.coupons = this.couponService.getCoupons();
    } catch {
      const alert = this.alertCtrl.create({
        title: 'Network Error',
        message: `Please check your connection and try again.`,
      });
      alert.present();
    }
    await loading.dismiss();

    console.log(this.coupons);
    return this.coupons;
  }

  cancel() {
    this.navCtrl.pop({
      animate: true,
      animation: 'md-transition',
      direction: 'back',
    });
  }
}
