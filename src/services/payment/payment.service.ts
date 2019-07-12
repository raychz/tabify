import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import config from '../../config';

@Injectable()
export class PaymentService {
  static testGatewayToken = 'JfWM7L1pAs304dRkaQlF6qpliui';

  constructor(private http: HttpClient) { }

  createGatewayPurchase(token: string, amount: number) {
    const url = `${config.serverUrl}/payment`;

    return this.http
      .post(url, {
        gateway: PaymentService.testGatewayToken,
        payment_method: token,
        amount,
      })
      .toPromise();
  }

  createPaymentMethod(details: any) {
    const url = `${config.serverUrl}/payment/method`;

    return this.http
      .post(url, {
        details
      })
      .toPromise();
  }
}
