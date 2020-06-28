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
    // maybe somehow parametize match variable and reuse this location gaurd in places like home/explore/:locationSlug where we show reviews
    const match = '/dine';
    const splitIndex = state.url.indexOf(match) + match.length;
    const preIndexUrl = state.url.substring(0, splitIndex);
    const postIndexUrl = state.url.substring(splitIndex);
    const urlSegments = postIndexUrl.split('/');
    const locationSlug = urlSegments[1];

    if (!this.locationService.locations) {
      await this.locationService.getLocations();
    }

    if (locationSlug) {
      const findLoc = {slug: locationSlug} as Location;
      const selectedLoc = this.locationService.selectLocation(findLoc);

      if (selectedLoc.slug === locationSlug) {
        return true;
      } else {
        urlSegments[1] = selectedLoc.slug;
        return this.router.parseUrl(`${preIndexUrl}${urlSegments.join('/')}`);
      }
    } else {
      const location = await this.locationService.selectDefaultLocation();
      urlSegments[1] = location.slug;
      return this.router.parseUrl(`${preIndexUrl}${urlSegments.join('/')}`);
    }
  }

  public async ionViewDidEnter() {
    console.log('ionViewDidLoad DinePage');
    console.log(this.locationService.selectedLocation);
    // await this.auth.signInWithEmail({email: '', password: ''});
  }

  public async showLocations() {
    await this.navCtrl.navigateForward('home/dine/locations');
    // await this.router.navigate(['home', 'dine', 'locations']);
    // await this.router.
  }
}
