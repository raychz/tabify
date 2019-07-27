import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import config from '../../config';

@Injectable()
export class PaymentService {
  static testGatewayToken = 'JfWM7L1pAs304dRkaQlF6qpliui';
  paymentMethods: any[] = [];

  constructor(private http: HttpClient) { }

  async initializePaymentMethods() {
    const methods = await this.getPaymentMethods();
    this.paymentMethods = methods.map((method: any) => ({
      ...method,
      card_type: this.mapCardType(method.card_type),
    }));
  }

  getPaymentMethods() {
    const url = `${config.serverUrl}/payment/method`;

    return this.http
      .get<any[]>(url)
      .toPromise();
  }

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

  mapCardType(type: string) {
    switch (type) {
      case 'visa':
        return 'Visa';
      case 'master':
        return 'MasterCard';
      case 'american_express':
        return 'AMEX';
      case 'discover':
        return 'Discover';
      case 'jcb':
        return 'JCB';
      case 'diners_club':
        return 'Diners Club';
      default:
        return 'Other'
    }
  }

  pushPaymentMethod(method: any) {
    this.paymentMethods = [
      ...this.paymentMethods,
      { ...method, card_type: this.mapCardType(method.card_type) }
    ];
  }
}
