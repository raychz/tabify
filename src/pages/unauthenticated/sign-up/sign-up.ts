import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AuthService } from '../../../services/auth.service';

@IonicPage()
@Component({
  selector: 'page-sign-up',
  templateUrl: 'sign-up.html',
})
export class SignUpPage {
  signupError: string;

  constructor(private navCtrl: NavController, private auth: AuthService) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SignUpPage');
  }

  signUpWithEmail() {
    this.navCtrl.push('SignUpWithEmailPage');
  }

  login() {
    this.navCtrl.pop().then(() => {
      this.navCtrl.push('LoginPage');
    });
  }
}
