import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { AuthService } from '../../../services/auth.service';

@IonicPage()
@Component({
  selector: 'page-sign-up',
  templateUrl: 'sign-up.html',
})
export class SignUpPage {
  signupError: string;

  constructor(private navCtrl: NavController, private auth: AuthService, private alertCtrl: AlertController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SignUpPage');
  }

  signUpWithEmail() {
    this.navCtrl.push('SignUpWithEmailPage');
  }

  signUpWithFacebook() {
    this.auth.signInWithFacebook().then(
      res => console.log(res),
      error => {
        const alert = this.alertCtrl.create({
          title: 'Error',
          subTitle: 'An error occurred while signing up with Facebook.',
          buttons: ['Ok']
        });
        alert.present();
        console.log("ERROR", error)
      }
    );
  }

  login() {
    this.navCtrl.pop().then(() => {
      this.navCtrl.push('LoginPage');
    });
  }
}
