import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { ILocation } from "../../interfaces/location.interface";
import config from "../../config";

@Injectable()
export class LocationService {
  constructor(private httpClient: HttpClient) {}

  public async getLocations(): Promise<ILocation[]> {
    return (
      this.httpClient.get(`${config.serverUrl}/locations`).toPromise() as Promise<ILocation[]>
    );
  }
}