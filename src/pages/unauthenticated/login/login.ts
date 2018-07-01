import { Component } from '@angular/core';
import { AlertController, IonicPage, LoadingController, NavController } from 'ionic-angular';
import { AuthService } from '../../../services/auth.service';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  constructor(public loadingCtrl: LoadingController, private navCtrl: NavController, private auth: AuthService, private alertCtrl: AlertController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  loginWithEmail() {
    this.navCtrl.push('LoginWithEmailPage');
  }

  loginWithFacebook() {
    const loading = this.loadingCtrl.create({
      content: 'Waiting on Facebook to log you in...',
      spinner: 'dots'
    });

    loading.present();

    return this.auth.signInWithFacebook()
      .then(
        res => {
          console.log(res);
          return res;
        },
        error => {
          const alert = this.alertCtrl.create({
            title: 'Error',
            subTitle: 'An error occurred while logging in with Facebook.',
            buttons: ['Ok']
          });
          return alert.present();
        }
      )
      .then(() => loading.dismiss());
  }

  signUp() {
    this.navCtrl.pop().then(() => {
      this.navCtrl.push('SignUpPage');
    })
  }
}
