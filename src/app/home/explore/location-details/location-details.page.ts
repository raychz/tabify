import { Component, OnInit } from '@angular/core';
import { LocationService } from 'src/services/location/location.service';

@Component({
  selector: 'app-location-details',
  templateUrl: './location-details.page.html',
  styleUrls: ['./location-details.page.scss'],
})
export class LocationDetailsPage implements OnInit {

  constructor(
    public locationService: LocationService
  ) { }

  ngOnInit() {
}

  }
