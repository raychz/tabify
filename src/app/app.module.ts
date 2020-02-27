import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, Injectable, Injector, NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { DecimalPipe } from '@angular/common';

import { IonicApp, IonicModule } from 'ionic-angular';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { Ionic2RatingModule } from 'ionic2-rating';

import { Tabify } from './app.component';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';

import { AngularFireModule } from '@angular/fire';
import { AngularFireAuth } from '@angular/fire/auth';
import { environment } from '@tabify/env';
import { AuthService } from '../services/auth/auth.service';
import { Facebook } from '@ionic-native/facebook/ngx';
import { LoaderService } from '../services/utilities/loader.service';
import { AlertService } from '../services/utilities/alert.service';
import { TokenInterceptor } from '../interceptors/token.interceptor';
import { TicketService } from '../services/ticket/ticket.service';
import { LocationService } from '../services/location/location.service';
import { FirestoreService } from '../services/firestore/firestore.service';
import { PaymentMethodService } from '../services/payment/payment-method.service';
import { StoryService } from '../services/story/story.service';
import { NewsfeedService } from '../services/newsfeed/newsfeed.service';
import { ErrorService } from '../services/error/error.service';
import { PaymentService } from '../services/payment/payment.service';
import { SharedPayModule } from '../pages/pay/shared-pay.module';
import * as Sentry from "@sentry/browser";

Sentry.init({
  dsn: environment.sentryDsn,
  release: `tabify-frontend@${environment.version}`,
  environment: environment.production ? 'production' : 'development',
  enabled: environment.production
});
@Injectable()
export class TabifyErrorHandler implements ErrorHandler {
  constructor(public auth: AuthService) { }

  handleError(error) {
    console.log('Sending error report to Sentry.', error);
    const eventId = Sentry.captureException(error.originalError || error);
    Sentry.showReportDialog({ eventId });
  }
}

@NgModule({
  declarations: [Tabify],
  imports: [
    BrowserModule,
    SharedPayModule.forRoot(),
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
    DecimalPipe,
    SplashScreen,
    // IonicErrorHandler,
    { provide: ErrorHandler, useClass: TabifyErrorHandler },
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
    LocationService,
    FirestoreService,
    PaymentMethodService,
    StoryService,
    NewsfeedService,
    ErrorService,
    PaymentService,
  ],
})
export class AppModule { }
