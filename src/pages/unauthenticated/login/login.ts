import { Component } from '@angular/core';
import { AlertController, IonicPage, NavController } from 'ionic-angular';
import { AuthService } from '../../../services/auth.service';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  constructor(private navCtrl: NavController, private auth: AuthService, private alertCtrl: AlertController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  loginWithEmail() {
    this.navCtrl.push('LoginWithEmailPage');
  }

  loginWithFacebook() {
    this.auth.signInWithFacebook().then(
      res => console.log(res),
      error => {
        const alert = this.alertCtrl.create({
          title: 'Error',
          subTitle: 'An error occurred while logging in with Facebook.',
          buttons: ['Ok']
        });
        alert.present();
        console.log("ERROR", error)
      }
    );
  }

  signUp() {
    this.navCtrl.pop().then(() => {
      this.navCtrl.push('SignUpPage');
    })
  }
}
