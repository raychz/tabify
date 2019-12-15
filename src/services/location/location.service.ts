import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Location } from "../../interfaces/location.interface";
import { FraudPreventionCode } from "../../interfaces/fraud-prevention-code.interface";
import { environment } from '@tabify/env';

@Injectable()
export class LocationService {
  constructor(private httpClient: HttpClient) {}

  public async getLocations(): Promise<Location[]> {
    return (
      this.httpClient.get<Location[]>(`${environment.serverUrl}/locations`).toPromise()
    );
  }

  public async getFraudPreventionCode(): Promise<FraudPreventionCode> {
    return (
      this.httpClient.get<FraudPreventionCode>(`${environment.serverUrl}/fraud-prevention-code`).toPromise()
    )
  }
}