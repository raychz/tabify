import { Component, ViewChild } from '@angular/core';
import { LocationService } from 'src/services/location/location.service';
import { Location } from 'src/interfaces/location.interface';
import { LoaderService } from 'src/services/utilities/loader.service';
import { AuthService } from 'src/services/auth/auth.service';
import { AlertService } from 'src/services/utilities/alert.service';
import { Content } from '@angular/compiler/src/render3/r3_ast';

@Component({
  selector: 'app-pay',
  templateUrl: 'pay.page.html',
  styleUrls: ['pay.page.scss']
})
export class PayPage {
  locations: Location[] = [
    {
        id: 1,
        omnivore_id: 'i8yBgkjT',
        name: 'Piccola Italia Ristorante',
        city: 'Manchester',
        country: 'USA',
        coupons_only: false,
        servers: [],
        tickets: [],
        state: 'NH',
        street1: '815 Elm St',
        street2: null,
        latitude: null,
        longitude: null,
        phone: null,
        timezone: null,
        website: null,
        photo_url: 'https://luparestaurant.com/wp-content/uploads/sites/33/2019/06/wEBSITE-PIC-1-upload-1920x1080.jpg',
        zip: null,
        google_place_id: null,
        tax_rate: null
    },
    {
      id: 2,
      omnivore_id: 'i8yBgkjT',
      name: 'Virtual POS',
      city: 'Cambridge',
      country: 'USA',
      coupons_only: true,
      servers: [],
      tickets: [],
      state: 'MA',
      street1: '16 York Pl',
      street2: null,
      latitude: null,
      longitude: null,
      phone: null,
      timezone: null,
      website: null,
      photo_url: null,
      zip: null,
      google_place_id: null,
      tax_rate: null
  }
];
selectedLocation = this.locations[0];


  constructor(
    public locationService: LocationService,
    public loader: LoaderService,
    public auth: AuthService,
    public alertCtrl: AlertService,
  ) {}

  // public ionViewCanEnter(): boolean {
  //   return this.auth.authenticated;
  // }

  public async ionViewDidEnter() {
    console.log('ionViewDidLoad PayPage');
    // await this.auth.signInWithEmail({email: '', password: ''});
    // this.getLocations();
  }

  private async getLocations() {
    const loading = await this.loader.create();
    await loading.present();
    try {
      this.locations = await this.locationService.getLocations();
      // this.searchLocations = this.locations;
      console.log('locations are', this.locations);
      await loading.dismiss();
    } catch (e) {
      await loading.dismiss();
      const alert = await this.alertCtrl.create({
        header: 'Network Error',
        message: `Please check your connection and try again.`,
      });
      alert.present();
      console.log(e);
    }
  }

}
