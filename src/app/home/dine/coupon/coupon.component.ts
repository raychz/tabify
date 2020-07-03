import { Component, OnInit } from '@angular/core';
import { CouponService } from 'src/services/coupon/coupon.service';
import { CouponGroup, CouponOffOf, CouponType } from 'src/enums';
import { Coupon } from 'src/interfaces/coupon.interface';
import { NavController, AlertController } from '@ionic/angular';
import { LoaderService } from 'src/services/utilities/loader.service';

@Component({
  selector: 'app-coupon',
  templateUrl: './coupon.component.html',
  styleUrls: ['./coupon.component.scss'],
})
export class CouponComponent implements OnInit {

  expandedCouponId: number;
  // Expose enum to template
  CouponOffOf = CouponOffOf;
  // Expose enum to template
  CouponType = CouponType;

  constructor(
    public navCtrl: NavController,
    public couponService: CouponService,
    public alertCtrl: AlertController,
    public loader: LoaderService,
  ) {}

  async ngOnInit() {
      await this.getCoupons();
  }

  expandCoupon(coupon: Coupon) {
    if (this.expandedCouponId === coupon.id) {
      this.expandedCouponId = -1;
    } else {
      this.expandedCouponId = coupon.id;
    }
  }

  async getCoupons() {
    const loading = await this.loader.create();
    loading.present();
    try {
      await this.couponService.getCoupons();
      this.expandedCouponId = -1;
    } catch(e) {
      // Sentry.captureException(e);
      const alert = await this.alertCtrl.create({
        header: 'Network Error',
        message: `Please check your connection and try again.`,
      });
      alert.present();
    }
    await loading.dismiss();
  }

  // async redeemCoupon(coupon: Coupon) {
  //   this.couponService.selectCoupon(coupon);
  //   if (!this.fullCouponsPage) {
  //     await this.navCtrl.pop()
  //   } else {
  //     await this.navCtrl.navigateForward('TabLookupPage', coupon.location);
  //   }
  // }

  // cancel() {
  //   this.navCtrl.pop({
  //     animate: true,
  //     animation: 'md-transition',
  //     direction: 'back',
  //   });
  // }
}