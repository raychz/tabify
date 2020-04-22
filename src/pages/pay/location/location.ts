import { Component } from '@angular/core';
import {
  IonicPage,
  NavController,
  NavParams,
  ViewController,
} from '@ionic/angular';
import { Location } from '../../../interfaces/location.interface';
import { LocationService } from '../../../services/location/location.service';
import { LoaderService } from '../../../services/utilities/loader.service';
import { AlertService } from '../../../services/utilities/alert.service';
import { AuthService } from '../../../services/auth/auth.service';

@IonicPage()
@Component({
  selector: 'page-location',
  templateUrl: 'location.html',
})
export class LocationPage {
  locations: Location[] = [];
  searchLocations: Location[] = [];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    public loader: LoaderService,
    private locationService: LocationService,
    public alertCtrl: AlertService,
    public auth: AuthService
  ) {
  }

  public ionViewCanEnter(): boolean {
    return this.auth.authenticated;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LocationPage');
    this.getLocations();
  }

  cancel() {
    this.navCtrl.pop({ animate: true, animation: 'md-transition', direction: 'back' })
  }

  async filterItems(ev: any) {
    this.searchLocations = this.locations;
    const search = ev.target.value;
    if (search && search.trim() !== '') {
      const modifiedSearch = search.toLowerCase().replace(/[^a-zA-Z\d\s]/gi, '');
      this.searchLocations = this.locations.filter((location) => {
        const locationName = location.name.toLowerCase().replace(/[^a-zA-Z\d\s]/gi, '');
        return (locationName.indexOf(modifiedSearch) > -1);
      });
    }
  }

  private async getLocations() {
    const loading = this.loader.create();
    await loading.present();
    try {
      this.locations = await this.locationService.getLocations();
      this.searchLocations = this.locations;
      console.log('locations are', this.locations);
      await loading.dismiss();
    } catch (e) {
      await loading.dismiss();
      const alert = this.alertCtrl.create({
        title: 'Network Error',
        message: `Please check your connection and try again.`,
      });
      alert.present();
      throw e;
    }
  }

  next() {
    this.navCtrl.push('TabLookupPage');
  }

  selectLocation(location: Location) {
    this.navCtrl.push('TabLookupPage', location);
  }
}
