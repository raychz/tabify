import { Component } from '@angular/core';
import {
  IonicPage,
  NavController,
  NavParams,
  ViewController,
} from 'ionic-angular';
import { ILocation } from '../../../interfaces/location.interface';
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
  locations: ILocation[] = [];

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

  // filterItems(ev: any) {
  //   this.getLocations();
  //   const { value } = ev.target;
  //   if (value && value.trim() !== '') {
  //     this.locations = this.locations.filter(
  //       location =>
  //         location.name.toLowerCase().indexOf(value.toLowerCase()) > -1
  //     );
  //   }
  // }

  private async getLocations() {
    const loading = this.loader.create();
    await loading.present();
    try {
      this.locations = await this.locationService.getLocations();
      console.log('locations are', this.locations);
    } catch {
      const alert = this.alertCtrl.create({
        title: 'Network Error',
        message: `Please check your connection and try again.`,
      });
      alert.present();
    }
    await loading.dismiss();
  }

  next() {
    this.navCtrl.push('TabLookupPage');
  }

  selectLocation(location: ILocation) {
    this.navCtrl.push('TabLookupPage', location);
  }
}
