import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, Injectable, Injector, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { AngularFireAuthModule } from 'angularfire2/auth';

import { Tabify } from './app.component';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Pro } from '@ionic/pro';

import { AngularFireModule } from 'angularfire2';
import { AngularFireAuth } from 'angularfire2/auth';
import { firebaseConfig } from '../config';
import { AuthService } from '../services/auth/auth.service';
import { Facebook } from '@ionic-native/facebook';
import { LoaderService } from '../services/utilities/loader.service';
import { AlertService } from '../services/utilities/alert.service';

Pro.init('66369498', {
  appVersion: '0.0.1',
});

@Injectable()
export class MyErrorHandler implements ErrorHandler {
  ionicErrorHandler: IonicErrorHandler;

  constructor(injector: Injector) {
    try {
      this.ionicErrorHandler = injector.get(IonicErrorHandler);
    } catch (e) {
      // Unable to get the IonicErrorHandler provider, ensure
      // IonicErrorHandler has been added to the providers list below
    }
  }

  handleError(err: any): void {
    Pro.monitoring.handleNewError(err);
    // Remove this if you want to disable Ionic's auto exception handling
    // in development mode.
    this.ionicErrorHandler && this.ionicErrorHandler.handleError(err);
  }
}

@NgModule({
  declarations: [Tabify],
  imports: [
    BrowserModule,
    IonicModule.forRoot(Tabify, {
      preloadModules: true,
    }),
    AngularFireModule.initializeApp(firebaseConfig.fire),
    AngularFireAuthModule,
  ],
  bootstrap: [IonicApp],
  entryComponents: [Tabify],
  providers: [
    StatusBar,
    SplashScreen,
    IonicErrorHandler,
    { provide: ErrorHandler, useClass: MyErrorHandler },
    AngularFireAuth,
    AuthService,
    Facebook,
    LoaderService,
    AlertService
  ],
})
export class AppModule {}
