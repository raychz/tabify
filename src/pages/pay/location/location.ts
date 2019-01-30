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
    private locationService: LocationService
  ) {
    this.getLocations();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LocationPage');
  }

  cancel() {
    const parentNav: NavController = this.navCtrl.parent;
    parentNav.setRoot(
      'HomePage',
      {},
      { animate: true, animation: 'md-transition', direction: 'back' }
    );
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
    this.loader.present();
    this.locations = await this.locationService.getLocations();
    this.loader.dismiss();
  }

  next() {
    this.navCtrl.push('TabLookupPage');
  }

  selectLocation(location: ILocation) {
    this.navCtrl.push('TabLookupPage', location);
  }
}
