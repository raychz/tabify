import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';

import { AuthService } from '../../../services/auth/auth.service';
import { LoaderService } from '../../../services/utilities/loader.service';
import { AlertService } from '../../../services/utilities/alert.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ErrorService } from '../../../services/error/error.service';

@IonicPage({
  priority: 'high'
})
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  loginForm: FormGroup;
  loginError: string = '';

  constructor(
    public navCtrl: NavController,
    public auth: AuthService,
    public alert: AlertService,
    public loader: LoaderService,
    public fb: FormBuilder,
    public errorService: ErrorService
  ) {
    this.loginForm = fb.group({
      email: ['', Validators.compose([Validators.required, Validators.email])],
      password: [
        '',
        Validators.compose([Validators.required, Validators.minLength(6), Validators.pattern(/^\S*$/)]),
      ],
    });
  }

  ionViewCanEnter() {
    // Only allow unauthenticated users to enter this page
    return !this.auth.authenticated;
  }

  async login() {
    const { email, password } = this.loginForm.value;

    if (email && password) {
      const loading = this.loader.create({
        content: 'Logging in...',
      });
      await loading.present();
      try {
        await this.auth.signInWithEmail({ email: email.trim(), password: password.trim() })
      } catch (e) {
        this.loginError = this.errorService.authError(e)
      }
      await loading.dismiss();
    }
  }

  async loginWithFacebook() {
    const loading = this.loader.create({
      content: 'Logging in with Facebook...',
    });
    await loading.present();
    await this.auth
      .signInWithFacebook()
      .catch(e => {
        const alert = this.alert.create({
          title: 'Error',
          subTitle: 'An error occurred while logging in with Facebook.',
          buttons: ['OK'],
        });
        return alert.present();
      })
    await loading.dismiss();
  }

  forgotPassword() {
    this.navCtrl.push('ForgotPasswordPage');
    return false;
  }

  async signUp() {
    await this.navCtrl.setRoot('UnauthenticatedPage');
    await this.navCtrl.push('SignUpPage');
  }

  inputChange() {
    // Remove trailing and leading spaces from both email and password inputs
    // to prevent user from seeing 'invalid email' validation errors
    const { email } = this.loginForm.value;
    this.loginForm.patchValue({ email: email.trim() }, { emitEvent: false });
  }
}
