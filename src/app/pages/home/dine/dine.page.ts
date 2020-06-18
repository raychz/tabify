import { Component, ViewChild, ElementRef } from '@angular/core';
import { LocationService } from 'src/services/location/location.service';
import { Location } from 'src/interfaces/location.interface';
import { LoaderService } from 'src/services/utilities/loader.service';
import { AuthService } from 'src/services/auth/auth.service';
import { AlertService } from 'src/services/utilities/alert.service';
import { TabsService } from 'src/services/tabs/tabs.service';
import { PopoverController, IonCard, NavController } from '@ionic/angular';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';

// export class ActivateDinePage implements CanActivate {

// }

@Component({
  selector: 'app-dine',
  templateUrl: 'dine.page.html',
  styleUrls: ['dine.page.scss']
})
export class DinePage implements CanActivate {
  @ViewChild('location', { static: false }) locationCard: any;

  constructor(
    public locationService: LocationService,
    public loader: LoaderService,
    public auth: AuthService,
    public router: Router,
    public navCtrl: NavController,
    public popover: PopoverController,
    public alertCtrl: AlertService,
  ) {}

  // public ionViewCanEnter(): boolean {
  //   return this.auth.authenticated;
  // }

  public async canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean | UrlTree> {
    console.log(route);
    console.log(state);
    const postDineUrl = state.url.split('/dine').pop();
    const urlSegments = postDineUrl.split('/');
    console.log(urlSegments);
    const locationSlug = urlSegments[1];
    if (locationSlug) {
      console.log('in true');
      const locations = await this.locationService.getLocations();
      console.log('slug is ', locationSlug);
      const locationIndex = locations.findIndex( loc => loc.slug === locationSlug);
      console.log(locationIndex);
      if (locationIndex !== -1) {
        console.log(locationIndex);
        this.locationService.selectLocation(locationIndex);
        return true;
      } else {
        const location = await this.locationService.selectDefaultLocation();
        urlSegments[1] = location.slug;
        console.log(`/home/dine/${urlSegments.join('/')}`);
        return this.router.parseUrl(`/home/dine${urlSegments.join('/')}`);
      }
    } else {
      const location = await this.locationService.selectDefaultLocation();
      urlSegments[1] = location.slug;
      console.log(`/home/dine/${urlSegments.join('/')}`);
      return this.router.parseUrl(`/home/dine${urlSegments.join('/')}`);
    }
  }

  public async ionViewDidEnter() {
    console.log('ionViewDidLoad DinePage');
    console.log(this.locationService.selectedLocation);
    // await this.auth.signInWithEmail({email: '', password: ''});
  }

  public async showLocations() {
    await this.navCtrl.navigateForward('home/locations');
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
