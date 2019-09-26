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
        Validators.compose([Validators.required, Validators.minLength(6)]),
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
        await this.auth.signInWithEmail({ email, password })
      } catch (error) {
        this.loginError = this.errorService.authError(error)
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
      .catch(error => {
        const alert = this.alert.create({
          title: 'Error',
          subTitle: 'An error occurred while logging in with Facebook.',
          buttons: ['Ok'],
        });
        return alert.present();
      })
    await loading.dismiss();
  }

  forgotPassword() {
    this.navCtrl.push('ForgotPasswordPage');
    return false;
  }

  signUp() {
    this.navCtrl.pop().then(() => {
      this.navCtrl.push('SignUpPage');
    });
  }
}
