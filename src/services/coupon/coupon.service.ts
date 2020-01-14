import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from '@tabify/env';
import { ICoupon, CouponOffOf, CouponType, CouponResponse } from "../../interfaces/coupon.interface";
import { AuthService } from "../../services/auth/auth.service";
import { Alert } from "ionic-angular";
import { AlertService } from "../utilities/alert.service";

@Injectable()
export class CouponService {

  public validCoupons: ICoupon[] = [];
  public usedCoupons: ICoupon[] = [];
  public upcomingCoupons: ICoupon[] = [];
  // empty coupon serves as a way to return a coupon with meaningless values - resolves 'not defined' issues
  private emptyCoupon: ICoupon = {id: undefined, image_url: undefined, usage_limit: undefined, description: undefined, value: 0, date_updated: undefined,
    date_created: undefined, coupon_start_date: undefined, coupon_end_date: undefined, coupon_off_of: undefined, applies_to_everyone: undefined,
    location: undefined, usage_count: undefined, coupon_type: undefined, estimated_dollar_value: 0, menu_item_name: undefined, menu_item_id: undefined,
    dollar_value: 0, estimated_tax_difference: 0};
  public selectedCoupon: ICoupon = this.emptyCoupon;

    constructor(private readonly httpClient: HttpClient, private alertCtrl: AlertService) { }

    // get a user's coupons from the backend server
    async getCoupons(): Promise<any> {

        const coupons = await this.httpClient.get(`${environment.serverUrl}/coupons`).toPromise() as CouponResponse;
        this.mapCouponResponse(coupons);
    }

    // map the coupon response object into the 3 coupon categories as well as convert string responses to objects
    private mapCouponResponse(coupons: CouponResponse) {

      this.validCoupons = coupons.validCoupons.map( coupon => {
        coupon.coupon_start_date = new Date(coupon.coupon_start_date);
        coupon.coupon_end_date = new Date(coupon.coupon_end_date);
        coupon.coupon_off_of = CouponOffOf[ coupon.coupon_off_of as any as string ];
        coupon.coupon_type = CouponType[ coupon.coupon_type as any as string ];
        return coupon;
      });

      this.usedCoupons = coupons.usedCoupons.map( coupon => {
        coupon.coupon_start_date = new Date(coupon.coupon_start_date);
        coupon.coupon_end_date = new Date(coupon.coupon_end_date);
        coupon.coupon_off_of = CouponOffOf[ coupon.coupon_off_of as any as string ];
        coupon.coupon_type = CouponType[ coupon.coupon_type as any as string ];
        return coupon;
      });
      this.upcomingCoupons = coupons.upcomingCoupons.map( coupon => {
        coupon.coupon_start_date = new Date(coupon.coupon_start_date);
        coupon.coupon_end_date = new Date(coupon.coupon_end_date);
        coupon.coupon_off_of = CouponOffOf[ coupon.coupon_off_of as any as string ];
        coupon.coupon_type = CouponType[ coupon.coupon_type as any as string ];
        return coupon;
      });
    }

    // get all valid coupons from the backend for a specific ticket and return an alert to tax tip - alert can possibly be undefined
    async getTicketCouponsAndReceiveCouponAlert(ticketId: number): Promise<Alert> {
      // create alert object to return to tax tip
      let alert: Alert;

      // back end request to get all valid coupons
      const coupons = await this.httpClient.get(`${environment.serverUrl}/coupons/ticket/${ticketId}`).toPromise() as CouponResponse;
      this.mapCouponResponse(coupons);

      // the best coupon is the first coupon - coupons are sorted based on dollar value
      const bestCoupon = this.validCoupons[0];

      // if there is no selected coupon
      if(this.selectedCoupon.value === 0) {
        // and there is a best coupon, set the selected coupon to the best one and tell the user, if not do nothing
        if (bestCoupon) {
          this.selectedCoupon = bestCoupon;
          alert = this.alertCtrl.create({
            title: 'Promo Found!',
            message: `We have found valid promo(s) for your ticket and have automatically applied the best one to your ticket.`,
            buttons: [
              'Ok',
            ],
          });
        }
        // there is a coupon selected
      } else {
        // find the coupon in the returned valid coupons - coupon will now have additional fields defined
        const updatedCoupon = this.validCoupons.find(coupon => coupon.id === this.selectedCoupon.id);
        // the coupon is still valid, set the selected coupon to the updated version
        if (updatedCoupon) {
          this.selectedCoupon = updatedCoupon;
          // if there is still a bettter coupon, set the alert accordingly asking if they would like to select the best one
          if (updatedCoupon.id !== bestCoupon.id) {
            alert = this.alertCtrl.create({
              title: 'Better Promo Found',
              message: `We have found a better promo with more savings than the one you originally selected. Would you like to automatically apply this better promo instead?`,
              buttons: [
                'No',
                {
                  text: 'Yes',
                  handler: () => {
                    this.selectCoupon(bestCoupon);
                  }
                },
              ],
            });
          }
          // the selected coupon is not valid
        } else {
          // if there is still a best coupon - set the selected coupon to the best one and tell the user
          if (bestCoupon) {
            this.selectedCoupon = bestCoupon;
            alert = this.alertCtrl.create({
              title: 'Invalid Promo',
              message: `The promo you originally selected is invalid, but we have automatically applied the best one available for your ticket.`,
              buttons: [
                'Ok',
              ],
            });
            // if there is no best coupon, set the selected coupon to the empty coupon and tell the user that there are no more coupons available
          } else {
            this.selectedCoupon = this.emptyCoupon;
            alert = this.alertCtrl.create({
              title: 'Invalid Promo',
              message: `The promo you originally selected is invalid and unfortunately there are no other available promos for your ticket.`,
              buttons: [
                'Ok',
              ],
            });
          }
        }
      }

      return alert;
    }

    // select or deselect a coupon
    selectCoupon(coupon: ICoupon) {
      if (this.selectedCoupon.id === coupon.id) {
        this.selectedCoupon = this.emptyCoupon;
      } else {
        this.selectedCoupon = coupon;
      }
    }
}
