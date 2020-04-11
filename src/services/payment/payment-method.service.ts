import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { environment } from '@tabify/env';

@Injectable({ providedIn: 'root' })
export class PaymentMethodService {
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
    const url = `${environment.serverUrl}/payment-methods`;

    return this.http
      .get<any[]>(url)
      .toPromise();
  }

  /**
   * Sends POST request to server to create new method.
   * @param method 
   */
  createPaymentMethod(details: any) {
    const url = `${environment.serverUrl}/payment-methods`;

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

  /**
   * Pushes method to local store.
   * @param method 
   */
  pushPaymentMethod(method: any) {
    this.paymentMethods = [
      ...this.paymentMethods,
      { ...method, card_type: this.mapCardType(method.card_type) }
    ];
  }

  /**
   * Removes method from local store.
   * @param method 
   */
  removePaymentMethod(method: any) {
    this.paymentMethods = this.paymentMethods.filter(m => m.id !== method.id);
  }

  /**
   * Sends DELETE request to server.
   * @param method 
   */
  deletePaymentMethod(method: any) {
    const url = `${environment.serverUrl}/payment-methods`;

    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      body: method,
    };

    return this.http.delete(url, options)
      .toPromise();
  }
}
