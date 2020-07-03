import { ErrorHandler, Injectable, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

////***********************
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFirestoreModule } from '@angular/fire/firestore';
// import { Ionic2RatingModule } from 'ionic2-rating';
import { Facebook } from '@ionic-native/facebook/ngx';

import { AngularFireModule } from '@angular/fire';
import { environment } from '@tabify/env';
import { AuthService } from '../services/auth/auth.service';
// import { SharedPayModule } from '../pages/dine/shared-dine.module';
import * as Sentry from "@sentry/browser";
import { TokenInterceptor } from '../interceptors/token.interceptor';

Sentry.init({
  dsn: environment.sentryDsn,
  release: `tabify-frontend@${environment.version}`,
  environment: environment.production ? 'production' : 'development',
  enabled: environment.production
});

@Injectable({ providedIn: 'root' })
export class TabifyErrorHandler implements ErrorHandler {
  constructor(public auth: AuthService) { }

  handleError(error) {
    console.log('Sending error report to Sentry.', error);
    const eventId = Sentry.captureException(error.originalError || error);
    Sentry.showReportDialog({ eventId });
  }
}
////***********************

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot({
      // TODO: Make scrollPadding false?
      // scrollPadding: false
    }),
    AppRoutingModule,
    HttpClientModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireAuthModule,
    AngularFirestoreModule,
    // TODO: Update to use a modern ionic rating module
    // Ionic2RatingModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true,
    },
    AppComponent,
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    Facebook,
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
