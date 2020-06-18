import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Location } from '../../interfaces/location.interface';
import { FraudPreventionCode } from '../../interfaces/fraud-prevention-code.interface';
import { environment } from '@tabify/env';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LocationService {
  locations: Location[];
  selectedLocation: Location;

  constructor(private httpClient: HttpClient) {}

  public async getLocations(): Promise<Location[]> {
    this.locations = await this.httpClient.get<Location[]>(`${environment.serverUrl}/locations`).toPromise();
    return this.locations;
  }

  public async selectDefaultLocation() {
      await this.getLocations();
      this.selectedLocation = this.locations[0];
      return this.selectedLocation;
  }

  public selectLocation(index: number) {
    this.selectedLocation = this.locations[index];
    return this.selectedLocation;
  }

  public async getFraudPreventionCode(): Promise<FraudPreventionCode> {
    return (
      this.httpClient.get<FraudPreventionCode>(`${environment.serverUrl}/fraud-prevention-code`).toPromise()
    );
  }
}
