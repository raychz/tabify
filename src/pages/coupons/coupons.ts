import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { AuthService } from '../../services/auth/auth.service';
import { LoaderService } from '../../services/utilities/loader.service';
import { CouponService } from '../../services/coupon/coupon.service';
import { ICoupon, CouponOffOf, CouponType } from '../../interfaces/coupon.interface';

enum CouponGroup {validCoupons, upcomingCoupons, expiredCoupons}

@IonicPage()
@Component({
  selector: 'page-coupons',
  templateUrl: 'coupons.html',
})
export class CouponsPage {

  selectedSegment: CouponGroup = CouponGroup.validCoupons;
  couponGroup = CouponGroup;
  expandedCouponId: number;
  // Expose enum to template
  CouponOffOf = CouponOffOf;
  // Expose enum to template
  CouponType = CouponType;

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

  selectSegment(event: {value: number}) {
    console.log(event);
    this.selectedSegment = event.value;
  }

  expandCoupon(coupon: ICoupon) {
    if (this.expandedCouponId === coupon.id) {
      this.expandedCouponId = -1;
    } else {
      this.expandedCouponId = coupon.id;
    }
  }

  async getCoupons() {
    const loading = this.loader.create();
    await loading.present();
    try {
      await this.couponService.getCoupons();
      this.expandedCouponId = -1;

    } catch {
      const alert = this.alertCtrl.create({
        title: 'Network Error',
        message: `Please check your connection and try again.`,
      });
      alert.present();
    }
    await loading.dismiss();
  }

  createNewCoupon() {
    this.couponService.createCoupon();
  }

  redeemCoupon(coupon: ICoupon) {
    this.couponService.selectCoupon(coupon);
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
