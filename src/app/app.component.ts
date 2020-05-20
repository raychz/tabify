import { Component } from '@angular/core';

import { Platform, AlertController, NavController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { LoaderService } from '../services/utilities/loader.service';
import { AuthService } from '../services/auth/auth.service';
import { tap } from 'rxjs/operators';
import * as Sentry from "@sentry/browser";

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    public loader: LoaderService,
    public auth: AuthService,
    public alertCtrl: AlertController,
    public navCtrl: NavController,
  ) {
    this.initializeApp();
  }

  async initializeApp() {
    const readySource = await this.platform.ready();
    console.log('Platform ready from', readySource);

    this.statusBar.styleDefault();
    this.splashScreen.hide();
    await this.checkAuthState();
  }

  async checkAuthState() {
    const loading = await this.loader.create();
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
            await this.navCtrl.navigateRoot('/welcome');
            await loading.dismiss();
            this.splashScreen.hide();
          }
        },
        async error => {
          // If an error occurs, send user back to unauthenticated screen.
          // Loader can be dismissed.
          console.log('IN SUBSCRIBE APP COMPONENT, ERROR: ', error);
          await this.navCtrl.navigateRoot('/welcome');
          this.splashScreen.hide();
          await loading.dismiss();
          const alert = await this.alertCtrl.create({
            header: 'Network Error',
            message: `Please check your connection and try again.`,
          });
          alert.present();
          throw error;
        }
      ))
      .subscribe(); // Subscribe here only!


    this.auth.userDetailsConfirmedInDB$
      .pipe(tap(
        async userDetailsConfirmedInDB => {
          if (userDetailsConfirmedInDB) {
            // If user has been created in Tabify's db
            // Loader can be dismissed.
            await this.navCtrl.navigateRoot('/tabs/tab1');
            // this.navCtrl.navigateForward('/welcome/sign-up');
            await loading.dismiss();
            this.splashScreen.hide();
          } else {
            // If user has not been created in Tabify's db
            // Loader can be dismissed.
            await this.navCtrl.navigateRoot('/welcome');
            await loading.dismiss();
            this.splashScreen.hide();
          }

          // Once we've authenticated user, let's set the Sentry scope for better error context
          Sentry.configureScope(scope => {
            scope.setUser({
              id: this.auth.getUid(),
              email: this.auth.getEmail(),
              displayName: this.auth.getDisplayName(),
            });
          });
        },
        error => {
          console.error('Error in user details tap', error);
        }
      ))
      .subscribe();
  }
}
