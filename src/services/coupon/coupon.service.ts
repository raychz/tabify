import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from '@tabify/env';
import { Coupon, CouponResponse } from "../../interfaces/coupon.interface";
import { AuthService } from "../../services/auth/auth.service";
import { AlertButton } from "ionic-angular";
import { AlertService } from "../utilities/alert.service";
import { AblyTicketService } from "../../services/ticket/ably-ticket.service";
import { CouponOffOf, CouponType } from '../../enums/coupons.enum'

@Injectable()
export class CouponService {

  public validCoupons: Coupon[] = [];
  public usedCoupons: Coupon[] = [];
  public upcomingCoupons: Coupon[] = [];
  public selectedCoupon: Coupon = undefined;

    constructor(private readonly httpClient: HttpClient,
      private ablyTicketService: AblyTicketService, private auth: AuthService) { }

    // get a user's coupons from the backend server
    async getCoupons(): Promise<any> {

        const coupons = await this.httpClient.get(`${environment.serverUrl}/coupons`).toPromise() as CouponResponse;
        console.log(coupons);
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
    async getTicketCouponsAndReceiveCouponAlertInfo(ticketId: number): Promise<object> {
      // create alert object to return to tax tip
      let alert: {title: string, message: string, buttons: (string | AlertButton)[]};

      // back end request to get all valid coupons
      const coupons = await this.httpClient.get(`${environment.serverUrl}/coupons/ticket/${ticketId}`).toPromise() as CouponResponse;
      this.mapCouponResponse(coupons);

      // the best coupon is the first coupon - coupons are sorted based on dollar value
      const bestCoupon = this.validCoupons[0];

      // check to see if the user already has a coupon applied
      const ticketUserCoupon = this.ablyTicketService.ticket.usersMap.get(this.auth.getUid()).selected_coupon;
      if (ticketUserCoupon) {
        this.selectedCoupon = ticketUserCoupon;
      } else {
        // if there is no selected coupon
        if(this.selectedCoupon === undefined) {
          // and there is a best coupon, set the selected coupon to the best one and tell the user, if not do nothing
          if (bestCoupon) {
            this.selectedCoupon = bestCoupon;
            alert = {
              title: 'Promo Found!',
              message: `We have found valid promo(s) for your ticket and have automatically applied the best one to your ticket.`,
              buttons: [
                'Ok',
              ],
            };
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
              alert = {
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
              };
            }
            // the selected coupon is not valid
          } else {
            // if there is still a best coupon - set the selected coupon to the best one and tell the user
            if (bestCoupon) {
              this.selectedCoupon = bestCoupon;
              alert = {
                title: 'Invalid Promo',
                message: `The promo you originally selected is invalid, but we have automatically applied the best one available for your ticket.`,
                buttons: [
                  'Ok',
                ],
              };
              // if there is no best coupon, set the selected coupon to undefined and tell the user that there are no more coupons available
            } else {
              this.selectedCoupon = undefined;
              alert = {
                title: 'Invalid Promo',
                message: `The promo you originally selected is invalid and unfortunately there are no other available promos for your ticket.`,
                buttons: [
                  'Ok',
                ],
              };
            }
          }
        }
      }
      return alert;
    }

    // select or deselect a coupon
    selectCoupon(coupon: Coupon) {
      if (this.selectedCoupon && this.selectedCoupon.id === coupon.id) {
        this.selectedCoupon = undefined;
      } else {
        this.selectedCoupon = coupon;
      }
    }
}
