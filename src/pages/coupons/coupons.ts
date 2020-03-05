import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, Platform } from 'ionic-angular';
import { AuthService } from '../../services/auth/auth.service';
import { LoaderService } from '../../services/utilities/loader.service';
import { CouponService } from '../../services/coupon/coupon.service';
import { Coupon } from '../../interfaces/coupon.interface';
import { CouponOffOf, CouponType, CouponGroup } from '../../enums/coupons.enum'
import * as Sentry from "@sentry/browser";

@IonicPage()
@Component({
  selector: 'page-coupons',
  templateUrl: 'coupons.html',
})
export class CouponsPage {

  selectedSegment: CouponGroup = CouponGroup.validCoupons;
  // Expose enum to template
  couponGroup = CouponGroup;
  fullCouponsPage = true;
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
    public platform: Platform,
  ) {}

  public ionViewCanEnter(): boolean {
    return this.auth.authenticated;
  }

  async ionViewDidLoad() {
    console.log('ionViewDidLoad CouponsPage');
    if (this.navParams.data.fullCouponsPage !== undefined) {
      this.fullCouponsPage = this.navParams.data.fullCouponsPage;
    }
    if (this.fullCouponsPage) {
      await this.getCoupons();
    }
  }

  selectSegment(event: {value: CouponGroup}) {
    this.selectedSegment = event.value;
  }

  expandCoupon(coupon: Coupon) {
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
    } catch(e) {
      Sentry.captureException(e);
      const alert = this.alertCtrl.create({
        title: 'Network Error',
        message: `Please check your connection and try again.`,
      });
      alert.present();
    }
    await loading.dismiss();
  }

  async redeemCoupon(coupon: Coupon) {
    this.couponService.selectCoupon(coupon);
    if (!this.fullCouponsPage) {
      await this.navCtrl.pop()
    } else {
      await this.navCtrl.push('TabLookupPage', coupon.location);
    }
  }

  cancel() {
    this.navCtrl.pop({
      animate: true,
      animation: 'md-transition',
      direction: 'back',
    });
  }
}
