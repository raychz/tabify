import { Component } from '@angular/core';
import { LocationService } from 'src/services/location/location.service';
import { Location } from 'src/interfaces/location.interface';
import { LoaderService } from 'src/services/utilities/loader.service';
import { AuthService } from 'src/services/auth/auth.service';
import { AlertService } from 'src/services/utilities/alert.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage {
  locations: Location[] = [];

  constructor(
    public locationService: LocationService,
    public loader: LoaderService,
    public auth: AuthService,
    public alertCtrl: AlertService,
  ) {}

  public ionViewCanEnter(): boolean {
    return this.auth.authenticated;
  }

  public async ionViewDidEnter() {
    console.log('ionViewDidLoad HomePage');
    await this.auth.signInWithEmail({email: '', password: ''});
    this.getLocations();
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
