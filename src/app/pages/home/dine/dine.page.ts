import { Component, ViewChild, ElementRef } from '@angular/core';
import { LocationService } from 'src/services/location/location.service';
import { Location } from 'src/interfaces/location.interface';
import { LoaderService } from 'src/services/utilities/loader.service';
import { AuthService } from 'src/services/auth/auth.service';
import { AlertService } from 'src/services/utilities/alert.service';
import { TabsService } from 'src/services/tabs/tabs.service';
import { PopoverController, IonCard } from '@ionic/angular';
import { LocationComponent } from './locations/location.component';

@Component({
  selector: 'app-dine',
  templateUrl: 'dine.page.html',
  styleUrls: ['dine.page.scss']
})
export class DinePage {
  @ViewChild('location', { static: false }) locationCard: any;


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
    console.log('ionViewDidLoad DinePage');
    this.tabsService.showTabs();
    // await this.auth.signInWithEmail({email: '', password: ''});
    if (!this.locationService.selectedLocation) {
      await this.selectDefaultLocation();
    }
  }

  public async showLocations(event: Event) {
    if (event.target !== this.locationCard.el) {
      // click el
    }

    const popover = await this.popover.create({
      component: LocationComponent,
      event,
      cssClass: 'popover-locations',
    });
    popover.present();
  }

  private async selectDefaultLocation() {
    const loading = await this.loader.create();
    await loading.present();
    try {
      await this.locationService.selectDefaultLocation();
      await loading.dismiss();
    } catch (e) {
      await loading.dismiss();
      const alert = await this.alertCtrl.create({
        header: 'Network Error',
        message: `Something went wrong, please check your connection and try again.`,
      });
      alert.present();
      console.log(e);
    }
  }

}
