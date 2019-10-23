import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { environment } from '@tabify/env';

@Injectable()
export class PaymentService {
  constructor(private http: HttpClient) { }

  sendTicketPayment(ticketId: number, paymentMethodId: number, amount: number, tip: number) {
    const url = `${environment.serverUrl}/tickets/${ticketId}/payments`;

    return this.http
      .post(url, {
        paymentMethodId,
        amount,
        tip,
      })
      .toPromise();
  }
}