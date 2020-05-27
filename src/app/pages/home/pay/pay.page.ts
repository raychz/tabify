import { Component, ViewChild } from '@angular/core';
import { LocationService } from 'src/services/location/location.service';
import { Location } from 'src/interfaces/location.interface';
import { LoaderService } from 'src/services/utilities/loader.service';
import { AuthService } from 'src/services/auth/auth.service';
import { AlertService } from 'src/services/utilities/alert.service';
import { TabsService } from 'src/services/tabs/tabs.service';
import { PopoverController } from '@ionic/angular';
import { LocationComponent } from './locations/location.component';

@Component({
  selector: 'app-pay',
  templateUrl: 'pay.page.html',
  styleUrls: ['pay.page.scss']
})
export class PayPage {
  locations: Location[];
  selectedLocation: Location;


  constructor(
    public locationService: LocationService,
    public loader: LoaderService,
    public auth: AuthService,
    public popover: PopoverController,
    public alertCtrl: AlertService,
    public tabsService: TabsService
  ) {}

  // public ionViewCanEnter(): boolean {
  //   return this.auth.authenticated;
  // }

  public async ionViewDidEnter() {
    console.log('ionViewDidLoad PayPage');
    this.tabsService.showTabs();
    // await this.auth.signInWithEmail({email: '', password: ''});
    if (!this.locations) {
      await this.getLocations();
    }
  }

  public async showLocations(event: any) {
    const popover = await this.popover.create({
      component: LocationComponent,
      event,
    });
    popover.present();
  }

  private async getLocations() {
    console.log('hi');
    const loading = await this.loader.create();
    await loading.present();
    try {
      this.locations = await this.locationService.getLocations();
      this.selectedLocation = this.locations[0];
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
