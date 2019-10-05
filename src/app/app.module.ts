import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, Injectable, Injector, NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';

import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { Ionic2RatingModule } from 'ionic2-rating';

import { Tabify } from './app.component';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Pro } from '@ionic/pro';

import { AngularFireModule } from '@angular/fire';
import { AngularFireAuth } from '@angular/fire/auth';
import { environment } from '@tabify/env';
import { AuthService } from '../services/auth/auth.service';
import { Facebook } from '@ionic-native/facebook';
import { LoaderService } from '../services/utilities/loader.service';
import { AlertService } from '../services/utilities/alert.service';
import { TokenInterceptor } from '../interceptors/token.interceptor';
import { TicketService } from '../services/ticket/ticket.service';
import { LocationService } from '../services/location/location.service';
import { FirestoreService } from '../services/firestore/firestore.service';
import { PaymentService } from '../services/payment/payment.service';
import { StoryService } from '../services/story/story.service';
import { NewsfeedService } from '../services/newsfeed/newsfeed.service';
import { TicketItemService } from '../services/ticket-item/ticket-item.service';
import { ErrorService } from '../services/error/error.service';


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
      scrollPadding: false,
    }),
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireAuthModule,
    AngularFirestoreModule,
    Ionic2RatingModule,
    HttpClientModule,
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
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true,
    },
    Facebook,
    LoaderService,
    AlertService,
    TicketService,
    LocationService,
    FirestoreService,
    PaymentService,
    StoryService,
    NewsfeedService,
    TicketItemService,
    ErrorService
  ],
})
export class AppModule { }
