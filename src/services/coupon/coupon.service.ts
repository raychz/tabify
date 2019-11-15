import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from '@tabify/env';

@Injectable()
export class CouponService {

    constructor(private readonly httpClient: HttpClient) { }

    // get stories that a user was part of (personal feed)
    async getCoupons(): Promise<any> {
        return await this.httpClient.get(`${environment.serverUrl}/coupons`).toPromise();
    }
}
