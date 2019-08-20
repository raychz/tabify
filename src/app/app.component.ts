import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, MenuController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AuthService } from '../services/auth/auth.service';
import { AlertService } from '../services/utilities/alert.service';
import { LoaderService } from '../services/utilities/loader.service';
import { tap } from 'rxjs/operators';

interface IPage {
  title: string;
  component: string;
  icon: string;
}
@Component({
  templateUrl: 'app.html',
})
export class Tabify {
  @ViewChild(Nav) nav!: Nav;

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
      // {
      //   title: 'Settings',
      //   component: 'PaymentMethodsPage',
      //   icon: 'cog',
      // },
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
      this.nav.setRoot(page.component);
    }
  }

  checkActivePage(page: IPage): boolean {
    const active = this.nav.getActive();
    return active && active.id === page.component;
  }

  async checkAuthState() {
    let loading = this.loader.create();
    await loading.present();
    this.auth
      .checkAuthState()
      .pipe(tap(
        user => {
          console.log('IN SUBSCRIBE APP COMPONENT, USER: ', user);
          if (!user) {
            this.rootPage = 'UnauthenticatedPage';
            loading.dismiss();
          }
          this.splashScreen.hide();
        },
        error => {
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

    this.auth.getUserDetailsConfirmedInDB()
      .pipe(tap(
        userDetailsConfirmedInDB => {
          // TODO: make sure that this doesn't get executed when behavior subject is initialized to false
          console.log('in the tap for user details', userDetailsConfirmedInDB);
          this.rootPage = userDetailsConfirmedInDB ? 'HomePage' : 'UnauthenticatedPage';
          this.splashScreen.hide();
          loading.dismiss();
        },
        error => {
          console.error('in error for user details tap', error);
        }
      ))
      .subscribe();
  }

  logout() {
    this.menu.close();
    this.auth.signOut();
  }
}
