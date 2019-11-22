import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { AuthService } from '../../services/auth/auth.service';
import { LoaderService } from '../../services/utilities/loader.service';
import { CouponService } from '../../services/coupon/coupon.service';
import { ICoupon } from '../../interfaces/coupon.interface';


@IonicPage()
@Component({
  selector: 'page-coupons',
  templateUrl: 'coupons.html',
})
export class CouponsPage {

  coupons: ICoupon[];
  expandedCouponId: number;

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

  expandCoupon(coupon: ICoupon) {
    this.expandedCouponId = coupon.id;
  }

  async getCoupons() {
    const loading = this.loader.create();
    await loading.present();
    try {
      this.coupons = await this.couponService.getCoupons() as ICoupon[];
      this.expandedCouponId = -1;
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

  redeemCoupon(coupon: ICoupon) {
    this.navCtrl.push('TabLookupPage', coupon.location);
  }

  cancel() {
    this.navCtrl.pop({
      animate: true,
      animation: 'md-transition',
      direction: 'back',
    });
  }
}
