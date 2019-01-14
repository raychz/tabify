import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, MenuController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AuthService } from '../services/auth/auth.service';
import { AlertService } from '../services/utilities/alert.service';

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

  rootPage: any;

  pages: Array<IPage>;

  constructor(
    public platform: Platform,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    public auth: AuthService,
    public menu: MenuController,
    public alertCtrl: AlertService
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
    ];
  }

  initializeApp() {
    this.platform.ready().then((readySource: string) => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      console.log('Platform ready from', readySource);
      this.checkAuthState();
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

  checkAuthState() {
    this.auth.afAuth.authState.subscribe(
      user => {
        console.log('IN SUBSCRIBE APP COMPONENT, USER: ', user);
        this.rootPage = user ? 'HomePage' : 'UnauthenticatedPage';
        this.splashScreen.hide();
      },
      error => {
        console.log('IN SUBSCRIBE APP COMPONENT, ERROR: ', error);
        this.rootPage = 'UnauthenticatedPage';
        this.splashScreen.hide();
        const alert = this.alertCtrl.create({
          title: 'Network Error',
          message: `Please check your connection and try again.`,
        });
        alert.present();
      }
    );
  }

  logout() {
    this.menu.close();
    this.auth.signOut();
  }
}
