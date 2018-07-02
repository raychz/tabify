import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';

import { AuthService } from '../../../services/auth/auth.service';
import { LoaderService } from '../../../services/utilities/loader.service';
import { AlertService } from '../../../services/utilities/alert.service';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  constructor(
    public navCtrl: NavController,
    public auth: AuthService,
    public alert: AlertService,
    public loader: LoaderService
  ) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  loginWithEmail() {
    this.navCtrl.push('LoginWithEmailPage');
  }

  loginWithFacebook() {
    this.loader.present({
      content: 'Logging in with Facebook...',
    });

    return this.auth
      .signInWithFacebook()
      .then(
        res => res,
        error => {
          const alert = this.alert.create({
            title: 'Error',
            subTitle: 'An error occurred while logging in with Facebook.',
            buttons: ['Ok'],
          });
          return alert.present();
        }
      )
      .then(() => this.loader.dismiss());
  }

  signUp() {
    this.navCtrl.pop().then(() => {
      this.navCtrl.push('SignUpPage');
    });
  }
}
