import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from '@tabify/env';
import { ICoupon, CouponOffOf, CouponType } from "../../interfaces/coupon.interface";
import { FirestoreTicketItem } from "../../services/ticket/ticket.service";

@Injectable()
export class CouponService {

  public validCoupons: ICoupon[];
  public expiredCoupons: ICoupon[];
  public upcomingCoupons: ICoupon[];
  private emptyCoupon: ICoupon = {id: null, usage_limit: null, description: null, value: 0, date_updated: null,
    date_created: null, coupon_start_date: null, coupon_end_date: null, coupon_off_of: null,
    location: null, usage_count: null, coupon_type: null, estimated_dollar_value: 0};
  public selectedCoupon: ICoupon = this.emptyCoupon;

    constructor(private readonly httpClient: HttpClient) { }

    // get stories that a user was part of (personal feed)
    async getCoupons(): Promise<any> {
        const coupons = await this.httpClient.get(`${environment.serverUrl}/coupons`).toPromise() as
        {
          validCoupons: ICoupon[],
          expiredCoupons: ICoupon[],
          upcomingCoupons: ICoupon[]
        };

        console.log(coupons);

        this.validCoupons = coupons.validCoupons.map( coupon => {
          coupon.coupon_start_date = new Date(coupon.coupon_start_date);
          coupon.coupon_end_date = new Date(coupon.coupon_end_date);
          return coupon;
        });

        console.log(this.validCoupons);

        this.expiredCoupons = coupons.expiredCoupons.map( coupon => {
          coupon.coupon_start_date = new Date(coupon.coupon_start_date);
          coupon.coupon_end_date = new Date(coupon.coupon_end_date);
          return coupon;
        });
        this.upcomingCoupons = coupons.upcomingCoupons.map( coupon => {
          coupon.coupon_start_date = new Date(coupon.coupon_start_date);
          coupon.coupon_end_date = new Date(coupon.coupon_end_date);
          return coupon;
        });
    }

    async filterValidCouponsAndFindBest(locationId: string, ticketItems: FirestoreTicketItem[], subtotal: number): Promise<ICoupon> {
     console.log(this.selectedCoupon);
      await this.getCoupons();
      let bestCoupon = undefined
      let bestCouponValue = -1;

      if (this.selectedCoupon && this.selectedCoupon.location.id !== parseInt(locationId)) {
        this.selectedCoupon = this.emptyCoupon;
      }

      console.log(this.validCoupons);
      this.validCoupons = this.validCoupons.filter( coupon => {
        if (coupon.location.id === parseInt(locationId)) {
          let couponValue = -1;
          let item = {price: subtotal};
          if(coupon.coupon_off_of === CouponOffOf.item) {
            item = ticketItems.find( ticketItem => {
              return ticketItem.ticket_item_id === coupon.menu_item_id;
            });
            if(!item) {
              return false;
            }
          }
          couponValue = coupon.value;
          if(coupon.coupon_type === CouponType.percent) {
            couponValue = item.price * (coupon.value / 100);
          }
          if(couponValue > bestCouponValue) {
            bestCouponValue = couponValue;
            bestCoupon = coupon;
          }
          return true;
        }
        return false;
      });

      console.log(this.validCoupons);
      console.log(bestCoupon);

      if(this.selectedCoupon.value === 0) {
        this.selectedCoupon = bestCoupon;
      }

      console.log(this.selectedCoupon);
      return bestCoupon;
    }

    selectCoupon(coupon: ICoupon) {
      this.selectedCoupon = coupon;
      console.log(`selected coupon is`);
      console.log(this.selectedCoupon);
    }

    async createCoupon() {
      const newCoupon = {
        description: "This is some example randomness text in orer to make sure everything works right in this post request",
        header: "50 off any order",
        usage_limit: 1,
        value: 50,
        coupon_start_date: new Date(),
        coupon_end_date: new Date(),
      };
      const res = await this.httpClient.post(`${environment.serverUrl}/coupons/location/1`,
          { newCoupon }).toPromise();
  }
}
