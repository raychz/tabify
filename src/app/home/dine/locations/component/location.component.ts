import { Component, OnInit, Input } from '@angular/core';
import { LocationService } from 'src/services/location/location.service';
import { LoaderService } from 'src/services/utilities/loader.service';
import { AlertService } from 'src/services/utilities/alert.service';
import { PopoverController, NavController } from '@ionic/angular';
import { Location } from 'src/interfaces/location.interface';

@Component({
  selector: 'app-location-component',
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.scss'],
})
export class LocationComponent {
  filteredLocations = this.locationService.locations;

  constructor(
    public locationService: LocationService,
    public loader: LoaderService,
    public alertCtrl: AlertService,
    public navCtrl: NavController,
  ) { }

  public async ionViewDidEnter() {
    await this.locationService.getLocations();
  }

  public async selectLocation(loc: Location) {
    const location = this.locationService.selectLocation(loc);
    await this.navCtrl.navigateRoot(`home/dine/${location.slug}`);
  }

  async filterItems(ev: any) {
    this.filteredLocations = this.locationService.locations;
    const search = ev.target.value;
    if (search && search.trim() !== '') {
      const modifiedSearch = search.toLowerCase().replace(/[^a-zA-Z\d\s]/gi, '');
      this.filteredLocations = this.locationService.locations.filter((location) => {
        const locationName = location.name.toLowerCase().replace(/[^a-zA-Z\d\s]/gi, '');
        return (locationName.indexOf(modifiedSearch) > -1);
      });
    }
  }
}
