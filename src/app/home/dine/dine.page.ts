import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { LocationService } from 'src/services/location/location.service';
import { Location } from 'src/interfaces/location.interface';
import { LoaderService } from 'src/services/utilities/loader.service';
import { AuthService } from 'src/services/auth/auth.service';
import { AlertService } from 'src/services/utilities/alert.service';
import { TabsService } from 'src/services/tabs/tabs.service';
import { PopoverController, IonCard, NavController } from '@ionic/angular';
import { CanActivate, ActivatedRoute, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';

// export class ActivateDinePage implements CanActivate {

// }

@Component({
  selector: 'app-dine',
  templateUrl: 'dine.page.html',
  styleUrls: ['dine.page.scss']
})
export class DinePage implements CanActivate, OnInit {
  @ViewChild('location', { static: false }) locationCard: any;

  constructor(
    public locationService: LocationService,
    public loader: LoaderService,
    public auth: AuthService,
    public router: Router,
    public navCtrl: NavController,
    public popover: PopoverController,
    public alertCtrl: AlertService,
    public activatedRoute: ActivatedRoute,
  ) {}

  // public ionViewCanEnter(): boolean {
  //   return this.auth.authenticated;
  // }

  public ngOnInit() {
    console.log(this.activatedRoute.queryParams);
  }

  // bug - this causes an infinite loop if selected location slug is an empty sting
  public async canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean | UrlTree> {
    // maybe somehow parametize match variable and reuse this location gaurd in places like home/explore/:locationSlug where we show reviews
    const splitUrl = state.url.split('?');
    const pathUrl = splitUrl[0];
    const queryParams = splitUrl[1];

    const match = '/dine';
    const splitIndex = pathUrl.indexOf(match) + match.length;
    const preIndexUrl = pathUrl.substring(0, splitIndex);
    const postIndexUrl = pathUrl.substring(splitIndex);
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
        return this.router.parseUrl(`${preIndexUrl}${urlSegments.join('/')}?${queryParams}`);
      }
    } else {
      const location = await this.locationService.selectDefaultLocation();
      urlSegments[1] = location.slug;
      return this.router.parseUrl(`${preIndexUrl}${urlSegments.join('/')}?${queryParams}`);
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
