import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../../services/auth/auth.service';

/**
 * Generated class for the LoginWithEmailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({
  priority: 'high'
})
@Component({
  selector: 'page-login-with-email',
  templateUrl: 'login-with-email.html',
})
export class LoginWithEmailPage {
  loginForm: FormGroup;
  loginError: string = '';

  constructor(public navCtrl: NavController, public navParams: NavParams, public fb: FormBuilder, private auth: AuthService) {
    this.loginForm = fb.group({
      email: ['', Validators.compose([Validators.required, Validators.email])],
      password: ['', Validators.compose([Validators.required, Validators.minLength(6)])]
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginWithEmailPage');
  }

  login() {
    const { email, password } = this.loginForm.value;

    if (email && password) {
      this.auth.signInWithEmail({ email, password })
        .then(
          () => this.navCtrl.setRoot('HomePage'),
          error => this.loginError = error.message
        );
    }
  }

  forgotPassword() {
    this.navCtrl.push('ForgotPasswordPage');
    return false;
  }
}
