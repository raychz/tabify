import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { AuthService } from '../../../services/auth/auth.service';
import { AlertService } from '../../../services/utilities/alert.service';
import { LoaderService } from '../../../services/utilities/loader.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

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
  // referralCode = this.navParams.get("referralCode");
  referralCode: string = '';
  signUpError: string = '';
  form: FormGroup;
  showServerCodeInput = false;
  showValidateCard = false;
  signUpStep = SignUpStep.REFERRAL_CODE_ENTRY;

  constructor(
    fb: FormBuilder,
    private navCtrl: NavController,
    private auth: AuthService,
    public alert: AlertService,
    public loader: LoaderService,
    private navParams: NavParams
  ) {
    this.form = fb.group({
      email: ['', Validators.compose([Validators.required, Validators.email])],
      password: [
        '',
        Validators.compose([Validators.required, Validators.minLength(6)]),
      ],
      firstName: ['', Validators.compose([Validators.required])],
      lastName: ['', Validators.compose([Validators.required])],
    });
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

  async signUp() {
    let data = this.form.value;
    let credentials = {
      email: data.email,
      password: data.password,
      firstName: data.firstName,
      lastName: data.lastName,
    };
    await this.auth.signUp(credentials).catch(error => {
      this.signUpError = error.message;
    });
  }

  login() {
    this.navCtrl.pop().then(() => {
      this.navCtrl.push('LoginPage');
    });
  }

  submitReferralCode() {
    console.log(this.referralCode);
    this.showValidateCard = true;
  }

  reEnterReferralCode() {
    this.referralCode = '';
    this.showValidateCard = false;
  }
}
