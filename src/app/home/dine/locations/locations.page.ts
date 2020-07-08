import { Component } from '@angular/core';
import { LocationService } from 'src/services/location/location.service';

@Component({
  selector: 'app-locations',
  templateUrl: './locations.page.html',
  styleUrls: ['./locations.page.scss'],
})
export class LocationsPage {
  
  constructor(
    public locationService: LocationService,
  ) { }

}
