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
        Validators.compose([Validators.required, Validators.minLength(6)]),
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
      .catch(
        error => {
          const alert = this.alert.create({
            title: 'Error',
            subTitle: 'An error occurred while signing up with Facebook.',
            buttons: ['Ok'],
          });
          return alert.present();
        }
      );
    await loading.dismiss();
  }

  async signUp() {
    let data = this.form.value;
    let credentials = {
      email: data.email,
      password: data.password,
      firstName: data.firstName,
      lastName: data.lastName,
      referralCode: this.referralCode
    };
    const loading = this.loader.create({
      content: 'Signing up...',
    });
    await loading.present();
    try {
      await this.auth.signUp(credentials)
    } catch (error) {
      this.signUpError = this.errorService.authError(error);
    };
    await loading.dismiss();
  }

  async login() {
    await this.navCtrl.pop().then(() => {
      this.navCtrl.push('LoginPage');
    });
  }
}
