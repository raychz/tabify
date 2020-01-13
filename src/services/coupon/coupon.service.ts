import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from '@tabify/env';
import { ICoupon, CouponOffOf, CouponType, CouponResponse } from "../../interfaces/coupon.interface";
import { AuthService } from "../../services/auth/auth.service";

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

    constructor(private readonly httpClient: HttpClient, private auth: AuthService) { }

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

    // get all valid coupons from the backend for a specific ticket
    async getTicketCouponsAndFindBest(ticketId: number, locationId: number): Promise<ICoupon> {
      // if the selected coupon is not of the ticket location - set the selected coupon to the empty coupon
      if (this.selectedCoupon.location && this.selectedCoupon.location.id !== locationId) {
        this.selectedCoupon = this.emptyCoupon;
      }

      const coupons = await this.httpClient.get(`${environment.serverUrl}/coupons/ticket/${ticketId}`).toPromise() as CouponResponse;
      this.mapCouponResponse(coupons);

      // the best coupon is the first coupon - coupons are sorted based on worth
      const bestCoupon = this.validCoupons[0];

      // if there is no selected coupon, set the selected coupon to the best coupon
      if(this.selectedCoupon.value === 0 && bestCoupon) {
        this.selectedCoupon = bestCoupon;
      } else {
        // set the selected coupon to the updated coupon object returned from the backend as it now has additional values
        const updatedCoupon = this.validCoupons.find(coupon => coupon.id === this.selectedCoupon.id);
        if (updatedCoupon) {
          this.selectedCoupon = updatedCoupon;
        } else {
          this.selectedCoupon = this.emptyCoupon;
        }
      }

      // return the best coupon or the empty coupon if there is no best coupon
      if (!bestCoupon) {
        return this.emptyCoupon;
      } else {
        return bestCoupon;
      }
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
