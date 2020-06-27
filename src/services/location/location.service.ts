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
    return this.locations;
  }

  public async selectDefaultLocation() {
      this.selectedLocation = this.locations.find(loc => loc.slug === 'VirtualPos');
      return this.selectedLocation;
  }

  public selectLocation(location: Location) {
    const foundLoc = this.locations.find(loc => loc.id === location.id);
    if (foundLoc) {
      this.selectedLocation = foundLoc;
    } else if (!this.selectedLocation) {
      this.selectDefaultLocation();
    }
    return this.selectedLocation;
  }

  public async getFraudPreventionCode(): Promise<FraudPreventionCode> {
    return (
      this.httpClient.get<FraudPreventionCode>(`${environment.serverUrl}/fraud-prevention-code`).toPromise()
    );
  }
}
