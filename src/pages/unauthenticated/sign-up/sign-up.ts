import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { AuthService } from '../../../services/auth/auth.service';
import { AlertService } from '../../../services/utilities/alert.service';
import { LoaderService } from '../../../services/utilities/loader.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ErrorService } from '../../../services/error/error.service';

enum SignUpStep {
  REFERRAL_CODE_ENTRY,
  USER_INFO_ENTRY
}
@IonicPage({
  priority: 'high'
})
@Component({
  selector: 'page-sign-up',
  templateUrl: 'sign-up.html',
})
export class SignUpPage {
  SignUpStep: typeof SignUpStep = SignUpStep; // Hack to expose enum to template
  //referralCode = this.navParams.get("referralCode");
  referralCode: string = '';
  signUpError: string = '';
  form: FormGroup;
  showServerCodeInput = false;
  signUpStep = SignUpStep.REFERRAL_CODE_ENTRY;

  constructor(
    fb: FormBuilder,
    private navCtrl: NavController,
    private auth: AuthService,
    public alert: AlertService,
    public loader: LoaderService,
    private navParams: NavParams,
    private errorService: ErrorService
  ) {
    this.form = fb.group({
      email: ['', Validators.compose([Validators.required, Validators.email])],
      password: [
        '',
        Validators.compose([Validators.required, Validators.minLength(6), Validators.pattern(/^\S*$/)]),
      ],
      firstName: ['', Validators.compose([Validators.required])],
      lastName: ['', Validators.compose([Validators.required])],
    });
  }

  ionViewCanEnter() {
    // Only allow unauthenticated users to enter this page
    return !this.auth.authenticated;
  }

  async signUpWithFacebook() {
    const loading = this.loader.create({
      content: 'Signing up with Facebook...',
    });
    await loading.present();
    await this.auth
      .signInWithFacebook()
      .catch(e => {
        console.error(e);
        loading.dismiss();
        const error = (e.code && e.message) ? `${e.code}: ${e.message}` : e;
        const alert = this.alert.create({
          title: 'Error',
          subTitle: 'An error occurred while signing up with Facebook. If this error persists, please continue with email instead.',
          message: error,
          buttons: ['OK'],
        });
        alert.present();
        throw e;
      }
      );
    await loading.dismiss();
  }

  async signUp() {
    const data = this.form.value;
    let credentials = {
      email: data.email.trim(),
      password: data.password.trim(),
      firstName: data.firstName.trim(),
      lastName: data.lastName.trim(),
      referralCode: this.referralCode && this.referralCode.trim()
    };
    const loading = this.loader.create({
      content: 'Signing up...',
    });
    await loading.present();
    try {
      await this.auth.signUp(credentials)
    } catch (e) {
      this.signUpError = this.errorService.authError(e);
    };
    await loading.dismiss();
  }

  async login() {
    await this.navCtrl.setRoot('UnauthenticatedPage');
    await this.navCtrl.push('LoginPage');
  }

  inputChange() {
    // Remove trailing and leading spaces from both email and password inputs
    // to prevent user from seeing 'invalid email' validation errors
    const { email } = this.form.value;
    this.form.patchValue({ email: email.trim() }, { emitEvent: false });
  }
}
