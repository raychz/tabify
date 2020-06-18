import { Component, OnInit, Input } from '@angular/core';
import { LocationService } from 'src/services/location/location.service';
import { LoaderService } from 'src/services/utilities/loader.service';
import { AlertService } from 'src/services/utilities/alert.service';
import { PopoverController, NavController } from '@ionic/angular';

@Component({
  selector: 'app-location-component',
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.scss'],
})
export class LocationComponent {

  constructor(
    public locationService: LocationService,
    public loader: LoaderService,
    public alertCtrl: AlertService,
    public navCtrl: NavController,
  ) { }

  public async ionViewDidEnter() {
    await this.locationService.getLocations();
  }

  public selectLocation(index: number) {
    const location = this.locationService.selectLocation(index);
    this.navCtrl.navigateRoot(`home/dine/${location.slug}`);
  }
}
