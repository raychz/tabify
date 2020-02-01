import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { environment } from '@tabify/env';

@Injectable()
export class PaymentService {
  constructor(private httpClient: HttpClient) { }

  sendTicketPayment(ticketId: number, paymentMethodId: number, amount: number, tip: number) {
    const url = `${environment.serverUrl}/tickets/${ticketId}/payments`;

    return this.httpClient
      .post(url, {
        paymentMethodId,
        amount,
        tip,
      })
      .toPromise();
  }

  async getTicketPaymentsByUser(ticketId: number) {
    const res = await this.httpClient.get(`${environment.serverUrl}/tickets/${ticketId}/payments`).toPromise();
    return res;
  }
}