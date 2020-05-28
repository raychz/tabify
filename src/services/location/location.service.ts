import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Location } from '../../interfaces/location.interface';
import { FraudPreventionCode } from '../../interfaces/fraud-prevention-code.interface';
import { environment } from '@tabify/env';

@Injectable({ providedIn: 'root' })
export class LocationService {
  locations: Location[];
  selectedLocation: Location;

  constructor(private httpClient: HttpClient) {}

  public async getLocations(): Promise<Location[]> {
    this.locations = await this.httpClient.get<Location[]>(`${environment.serverUrl}/locations`).toPromise();
    this.selectedLocation = this.locations[0];
    return this.locations;
  }

  public async getFraudPreventionCode(): Promise<FraudPreventionCode> {
    return (
      this.httpClient.get<FraudPreventionCode>(`${environment.serverUrl}/fraud-prevention-code`).toPromise()
    );
  }
}
