import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { environment } from '@tabify/env';
import { ICoupon } from 'interfaces/coupon.interface';

@Injectable()
export class PaymentService {
  constructor(private http: HttpClient) { }

  sendTicketPayment(ticketId: number, paymentMethodId: number, amount: number, tip: number, coupon: ICoupon) {
    const url = `${environment.serverUrl}/tickets/${ticketId}/payments`;
    const body = {
      paymentMethodId,
      amount,
      tip,
      coupon: undefined,
    }
    if(coupon.value > 0) {
      body["coupon"] = coupon;
    }

    return this.http
      .post(url, body)
      .toPromise();
  }
}
