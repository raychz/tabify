import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { environment } from '@tabify/env';
import { IPaymentResponse, ITransactionStatus } from '@ionic-native/apple-pay/ngx';

@Injectable()
export class ApplePayService {
  constructor(private httpClient: HttpClient) { }

  completeTransactionWithMerchant(applePayTransaction: IPaymentResponse): Promise<ITransactionStatus> {
    const url = `${environment.serverUrl}/applepay`;

    return this.httpClient
      .post<ITransactionStatus>(url, {
        applePayTransaction
      })
      .toPromise();
  }
}