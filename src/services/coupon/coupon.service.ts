import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from '@tabify/env';
import { ICoupon, CouponOffOf, CouponType, CouponResponse } from "../../interfaces/coupon.interface";
import { FirestoreTicketItem } from "../../services/ticket/ticket.service";
import { TicketItem } from '../../interfaces/ticket-item.interface';
import currency from 'currency.js';
import { AuthService } from "../../services/auth/auth.service";

@Injectable()
export class CouponService {

  public validCoupons: ICoupon[] = [];
  public usedCoupons: ICoupon[] = [];
  public upcomingCoupons: ICoupon[] = [];
  private emptyCoupon: ICoupon = {id: undefined, image_url: undefined, usage_limit: undefined, description: undefined, value: 0, date_updated: undefined,
    date_created: undefined, coupon_start_date: undefined, coupon_end_date: undefined, coupon_off_of: undefined, applies_to_everyone: undefined,
    location: undefined, usage_count: undefined, coupon_type: undefined, estimated_dollar_value: 0, menu_item_name: undefined, menu_item_id: undefined,
    dollar_value: 0, estimated_tax_difference: 0};
  public selectedCoupon: ICoupon = this.emptyCoupon;

    constructor(private readonly httpClient: HttpClient, private auth: AuthService) { }

    async getCoupons(): Promise<any> {

        const coupons = await this.httpClient.get(`${environment.serverUrl}/coupons`).toPromise() as CouponResponse;
        this.mapCouponResponse(coupons);
    }

    private mapCouponResponse(coupons: CouponResponse) {

      console.log(coupons);

      this.validCoupons = coupons.validCoupons.map( coupon => {
        coupon.coupon_start_date = new Date(coupon.coupon_start_date);
        coupon.coupon_end_date = new Date(coupon.coupon_end_date);
        coupon.coupon_off_of = CouponOffOf[ coupon.coupon_off_of as any as string ];
        coupon.coupon_type = CouponType[ coupon.coupon_type as any as string ];
        return coupon;
      });

      console.log(this.validCoupons);

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
      console.log(this.selectedCoupon);
    }

    async getApplicableCoupons(ticketId: number, locationId: number): Promise<ICoupon> {
      if (this.selectedCoupon.location && this.selectedCoupon.location.id !== locationId) {
        this.selectedCoupon = this.emptyCoupon;
      }

      const coupons = await this.httpClient.get(`${environment.serverUrl}/coupons/ticket/${ticketId}`).toPromise() as CouponResponse;
      this.mapCouponResponse(coupons);

      const bestCoupon = this.validCoupons[0];

      if(this.selectedCoupon.value === 0 && bestCoupon) {
        this.selectedCoupon = bestCoupon;
      } else {
        const updatedCoupon = this.validCoupons.find(coupon => coupon.id === this.selectedCoupon.id);
        if (updatedCoupon) {
          this.selectedCoupon = updatedCoupon;
        } else {
          this.selectedCoupon = this.emptyCoupon;
        }
      }

      if (!bestCoupon) {
        return this.emptyCoupon;
      } else {
        return bestCoupon;
      }
    }

    selectCoupon(coupon: ICoupon) {
      if (this.selectedCoupon.id === coupon.id) {
        this.selectedCoupon = this.emptyCoupon;
      } else {
        this.selectedCoupon = coupon;
      }
      console.log(`selected coupon is`);
      console.log(this.selectedCoupon);
    }

  //   async createCoupon() {
  //     const newCoupon = {
  //       description: "This is some example randomness text in orer to make sure everything works right in this post request",
  //       usage_limit: 1,
  //       applies_to_everyone: true,
  //       coupon_off_of: CouponOffOf.ticket,
  //       coupon_type: CouponType.dollar_value,
  //       estimated_dollar_value: 500,
  //       value: 500,
  //       coupon_start_date: new Date(),
  //       coupon_end_date: new Date(),
  //     };
  //     const res = await this.httpClient.post(`${environment.serverUrl}/coupons/location/i8yBgkjT`,
  //         { newCoupon }).toPromise();
  //     console.log(res);
  // }
}
