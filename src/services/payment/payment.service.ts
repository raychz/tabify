import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import config from '../../config';

@Injectable()
export class PaymentService {
  static testGatewayToken = 'JfWM7L1pAs304dRkaQlF6qpliui';
  static API_ENDPOINTS = {
    createGatewayPurchase: `/payment`,
  };

  constructor(private http: HttpClient) {}

  createGatewayPurchase(token, amount) {
    const url = `${config.serverUrl}${PaymentService.API_ENDPOINTS.createGatewayPurchase}`;

    return this.http
      .post(url, {
        gateway: PaymentService.testGatewayToken,
        payment_method: token,
        amount,
      })
      .toPromise();
  }
}
