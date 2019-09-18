import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { ILocation } from "../../interfaces/location.interface";
import { IFraudPreventionCode } from "../../interfaces/fraud-prevention-code.interface";
import { config } from "../../config";

@Injectable()
export class LocationService {
  constructor(private httpClient: HttpClient) {}

  public async getLocations(): Promise<ILocation[]> {
    return (
      this.httpClient.get<ILocation[]>(`${config.serverUrl}/locations`).toPromise()
    );
  }

  public async getFraudPreventionCode(): Promise<IFraudPreventionCode> {
    return (
      this.httpClient.get<IFraudPreventionCode>(`${config.serverUrl}/fraud-prevention-code`).toPromise()
    )
  }
}