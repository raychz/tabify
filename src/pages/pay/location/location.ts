import { Component } from '@angular/core';
import {
  IonicPage,
  NavController,
  NavParams,
  ViewController,
} from 'ionic-angular';

export interface Location {
  name: string;
  city: string;
  streetAddress: string;
  distance: number;
  photoUrl: string;
}
@IonicPage()
@Component({
  selector: 'page-location',
  templateUrl: 'location.html',
})
export class LocationPage {
  locations: Location[];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController
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

  filterItems(ev) {
    this.getLocations();
    const { value } = ev.target;
    if (value && value.trim() !== '') {
      this.locations = this.locations.filter(
        location =>
          location.name.toLowerCase().indexOf(value.toLowerCase()) > -1
      );
    }
  }

  getLocations() {
    this.locations = [
      {
        name: 'The Smoke Shop BBQ',
        city: 'Cambridge, MA',
        streetAddress: '25 Hampshire St.',
        distance: 0.01,
        photoUrl: 'assets/imgs/restaurants/smokeshop.png',
      },
      {
        name: "Mamaleh's Delicatessen",
        city: 'Cambridge, MA',
        streetAddress: '15 Hampshire St.',
        distance: 0.01,
        photoUrl: 'assets/imgs/restaurants/mamalehs.png',
      },
      {
        name: 'Naco Taco',
        city: 'Cambridge, MA',
        streetAddress: '297 Massachusetts Ave.',
        distance: 0.6,
        photoUrl: 'assets/imgs/restaurants/naco-taco.png',
      },
      {
        name: 'The Smoke Shop BBQ - Seaport',
        city: 'Boston, MA',
        streetAddress: '343 Congress St.',
        distance: 3.0,
        photoUrl: 'assets/imgs/restaurants/smokeshop.png',
      },
    ];
  }

  next() {
    this.navCtrl.push('TabLookupPage');
  }

  selectLocation(location) {
    this.navCtrl.push('TabLookupPage', location);
  }
}
