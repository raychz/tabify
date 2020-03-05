import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { environment } from '@tabify/env';
import { Coupon } from 'interfaces/coupon.interface';

@Injectable()
export class PaymentService {
  constructor(private http: HttpClient) { }

  sendTicketPayment(ticketId: number, paymentMethodId: number, amount: number, tip: number, couponId: number) {
    const url = `${environment.serverUrl}/tickets/${ticketId}/payments`;
    const body = {
      paymentMethodId,
      amount,
      tip,
      couponId,
    }

    return this.http
      .post(url, body)
      .toPromise();
  }

  async getTicketPaymentsByUser(ticketId: number) {
    const res = await this.http.get(`${environment.serverUrl}/tickets/${ticketId}/payments`).toPromise();
    return res;
  }
}
