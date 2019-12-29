import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from '@tabify/env';
import { ICoupon, CouponOffOf, CouponType } from "../../interfaces/coupon.interface";
import { FirestoreTicketItem } from "../../services/ticket/ticket.service";
import { TicketItem } from '../../interfaces/ticket-item.interface';
import currency from 'currency.js';

@Injectable()
export class CouponService {

  public validCoupons: ICoupon[];
  public expiredCoupons: ICoupon[];
  public upcomingCoupons: ICoupon[];
  private emptyCoupon: ICoupon = {id: undefined, usage_limit: undefined, description: undefined, value: 0, date_updated: undefined,
    date_created: undefined, coupon_start_date: undefined, coupon_end_date: undefined, coupon_off_of: undefined,
    location: undefined, usage_count: undefined, coupon_type: undefined, estimated_dollar_value: 0, menu_item_name: undefined, menu_item_id: undefined};
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
          coupon.coupon_off_of = CouponOffOf[ coupon.coupon_off_of as any as string ];
          coupon.coupon_type = CouponType[ coupon.coupon_type as any as string ];
          return coupon;
        });

        console.log(this.validCoupons);

        this.expiredCoupons = coupons.expiredCoupons.map( coupon => {
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

    async filterValidCouponsAndFindBest(locationId: number, ticketItems: TicketItem[], subtotal: number): Promise<ICoupon> {
     console.log(this.selectedCoupon);
     console.log(ticketItems);
      await this.getCoupons();
      let bestCoupon = undefined
      let bestCouponValue = -1;

      if (this.selectedCoupon && this.selectedCoupon.location && this.selectedCoupon.location.id !== locationId) {
        this.selectedCoupon = this.emptyCoupon;
      }

      console.log(this.validCoupons);
      this.validCoupons = this.validCoupons.filter( coupon => {
        if (coupon.location && coupon.location.id === locationId) {
          let couponValue = -1;
          let item = {price: subtotal};
          if(coupon.coupon_off_of === CouponOffOf.item) {
            const couponTicketItem = ticketItems.find( ticketItem => {
              return ticketItem.ticket_item_id === coupon.menu_item_id;
            });
            if(!couponTicketItem) {
              return false;
            }
            coupon.menu_item_name = couponTicketItem.name;
            item = couponTicketItem;
          }
          couponValue = coupon.value;
          if(coupon.coupon_type === CouponType.percent) {
            couponValue = currency(item.price / 100).multiply(coupon.value / 100).intValue;
          }
          if(couponValue > bestCouponValue) {
            bestCouponValue = couponValue;
            bestCoupon = coupon;
          }
          coupon.estimated_dollar_value = couponValue;
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

  //   async createCoupon() {
  //     const newCoupon = {
  //       description: "This is some example randomness text in orer to make sure everything works right in this post request",
  //       header: "50 off any order",
  //       usage_limit: 1,
  //       value: 50,
  //       coupon_start_date: new Date(),
  //       coupon_end_date: new Date(),
  //     };
  //     const res = await this.httpClient.post(`${environment.serverUrl}/coupons/location/1`,
  //         { newCoupon }).toPromise();
  // }
}
