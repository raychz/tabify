import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';

import { AuthService } from '../../../services/auth/auth.service';
import { AlertService } from '../../../services/utilities/alert.service';
import { LoaderService } from '../../../services/utilities/loader.service';

@IonicPage({
  priority: 'high'
})
@Component({
  selector: 'page-sign-up',
  templateUrl: 'sign-up.html',
})
export class SignUpPage {
  constructor(
    private navCtrl: NavController,
    private auth: AuthService,
    public alert: AlertService,
    public loader: LoaderService
  ) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad SignUpPage');
  }

  signUpWithEmail() {
    this.navCtrl.push('SignUpWithEmailPage');
  }

  signUpWithFacebook() {
    this.loader.present({
      content: 'Signing up with Facebook...',
    });

    return this.auth
      .signInWithFacebook()
      .then(
        res => res,
        error => {
          const alert = this.alert.create({
            title: 'Error',
            subTitle: 'An error occurred while signing up with Facebook.',
            buttons: ['Ok'],
          });
          return alert.present();
        }
      )
      .then(() => this.loader.dismiss());
  }

  login() {
    this.navCtrl.pop().then(() => {
      this.navCtrl.push('LoginPage');
    });
  }
}
