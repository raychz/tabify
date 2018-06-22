import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { AuthService } from '../../../services/auth.service';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  constructor(private navCtrl: NavController, private auth: AuthService) {
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
      error => console.log("ERROR", error)
    );
  }

  signUp() {
    this.navCtrl.pop().then(() => {
      this.navCtrl.push('SignUpPage');
    })
  }
}
