import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, MenuController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AuthService } from '../services/auth.service';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any;

  pages: Array<{ title: string, component: any }>;

  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen, private auth: AuthService, private menu: MenuController) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Home', component: 'HomePage' },
      { title: 'List', component: 'ListPage' }
    ];
  }

  initializeApp() {
    this.platform.ready().then(readySource => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      console.log('Platform ready from', readySource);
      this.statusBar.backgroundColorByHexString("#ffffff");
      this.splashScreen.hide();
      this.auth.afAuth.authState
        .subscribe(
          user => {
            console.log("IN SUBSCRIBE APP COMPONENT, USER: ", user);
            this.rootPage = user ? 'HomePage' : 'UnauthenticatedPage';
            this.menu.swipeEnable(!!user); // Disable menu swipe if unauthenticated
          },
          (error) => {
            console.log("IN SUBSCRIBE APP COMPONENT, ERROR: ", error);
            this.rootPage = 'UnauthenticatedPage';
            this.menu.swipeEnable(false);
          }
        );
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }

  login() {
    this.menu.close();
    this.auth.signOut();
    this.nav.setRoot('UnauthenticatedPage');
  }

  logout() {
    this.menu.close();
    this.auth.signOut();
    this.nav.setRoot('HomePage');
  }
}
