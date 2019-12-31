import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { environment } from '@tabify/env';
import { ICoupon } from 'interfaces/coupon.interface';

@Injectable()
export class PaymentService {
  constructor(private http: HttpClient) { }

  sendTicketPayment(ticketId: number, paymentMethodId: number, amount: number, tip: number, couponId: number) {
    const url = `${environment.serverUrl}/tickets/${ticketId}/payments`;
    const body = {
      paymentMethodId,
      amount,
      tip,
      couponId: couponId,
    }

    return this.http
      .post(url, body)
      .toPromise();
  }
}
