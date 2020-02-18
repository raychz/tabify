import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, MenuController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { AuthService } from '../services/auth/auth.service';
import { AlertService } from '../services/utilities/alert.service';
import { LoaderService } from '../services/utilities/loader.service';
import { tap } from 'rxjs/operators';
import { PaymentDetailsPageMode } from '../pages/payment-methods/payment-details/payment-details';
import { NewsfeedService } from '../services/newsfeed/newsfeed.service';

interface IPage {
  title: string;
  component: string;
  icon: string;
}
@Component({
  templateUrl: 'app.html',
})
export class Tabify {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = 'LoadingPage';

  pages: Array<IPage>;

  constructor(
    public platform: Platform,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    public auth: AuthService,
    public menu: MenuController,
    public alertCtrl: AlertService,
    public loader: LoaderService,
    public newsFeedService: NewsfeedService,
  ) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Home', component: 'HomePage', icon: 'home' },
      {
        title: 'Payment Methods',
        component: 'PaymentMethodsPage',
        icon: 'card',
      },
      {
        title: 'Help',
        component: 'HelpPage',
        icon: 'help-circle',
      },
    ];
  }

  async initializeApp() {
    const readySource = await this.platform.ready();
    console.log('Platform ready from', readySource);
    // Okay, so the platform is ready and our plugins are available.
    // Here you can do any higher level native things you might need.
    await this.checkAuthState();
    this.statusBar.overlaysWebView(false);
    this.statusBar.styleLightContent();
    this.statusBar.hide();
    this.platform.registerBackButtonAction(() => {
      if (this.menu.isOpen()) {
        this.menu.close();
      } else if (this.nav.canGoBack()) {
        this.nav.pop();
      } else {
        //don't do anything
      }
    });
  }

  openPage(page: IPage) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    if (this.nav.getActive().id === page.component) {
      this.menu.close();
    } else {
      if (page.component === 'PaymentMethodsPage')
        this.nav.setRoot(page.component, { mode: PaymentDetailsPageMode.SAVE_ONLY });
      else
        this.nav.setRoot(page.component);
    }
  }

  checkActivePage(page: IPage): boolean {
    const active = this.nav.getActive();
    return active && active.id === page.component;
  }

  async checkAuthState() {
    let loading = this.loader.create();
    // Present loader while the auth check is being completed.
    await loading.present();

    this.auth
      .checkAuthState()
      .pipe(tap(
        async (user) => {
          console.log('IN SUBSCRIBE APP COMPONENT, USER: ', user);
          if (user) {
            // If user is authenticated on Firebase, 
            // wait until the user is created in our DB.
            // The loader will be dismissed in the second pipe/tap below.
            await this.auth.checkUserExistsInDB();
          } else {
            // Otherwise, send user back to unauthenticated screen.
            // Loader can be dismissed.
            this.rootPage = 'UnauthenticatedPage';
            loading.dismiss();
            this.splashScreen.hide();
          }
        },
        error => {
          // If an error occurs, send user back to unauthenticated screen.
          // Loader can be dismissed.
          console.log('IN SUBSCRIBE APP COMPONENT, ERROR: ', error);
          this.rootPage = 'UnauthenticatedPage';
          this.splashScreen.hide();
          loading.dismiss();
          const alert = this.alertCtrl.create({
            title: 'Network Error',
            message: `Please check your connection and try again.`,
          });
          alert.present();
        }
      ))
      .subscribe(); // Subscribe here only!


    this.auth.userDetailsConfirmedInDB$
      .pipe(tap(
        async userDetailsConfirmedInDB => {
          if (userDetailsConfirmedInDB) {
            // If user has been created in Tabify's db
            // Loader can be dismissed.
            this.rootPage = 'HomePage';
            loading.dismiss();
            this.splashScreen.hide();
          } else {
            // If user has not been created in Tabify's db
            // Loader can be dismissed.
            this.rootPage = 'UnauthenticatedPage';
            loading.dismiss();
            this.splashScreen.hide();
          }
        },
        error => {
          console.error('Error in user details tap', error);
        }
      ))
      .subscribe();
  }

  logout() {
    this.menu.close();
    this.newsFeedService.clearFeed();
    this.auth.signOut();
  }
}
