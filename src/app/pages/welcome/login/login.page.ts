import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { AuthService } from '../../../../services/auth/auth.service';
import { AlertService } from '../../../../services/utilities/alert.service';
import { LoaderService } from '../../../../services/utilities/loader.service';
import { ErrorService } from '../../../../services/error/error.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  loginForm: FormGroup;
  loginError = '';

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

  ngOnInit() {
  }

  async login() {
    const { email, password } = this.loginForm.value;

    if (email && password) {
      const loading = await this.loader.create({
        message: 'Logging in...',
      });
      await loading.present();
      try {
        await this.auth.signInWithEmail({ email: email.trim(), password: password.trim() })
      } catch (e) {
        this.loginError = this.errorService.authError(e);
      }
      await loading.dismiss();
    }
  }

  async loginWithFacebook() {
    const loading = await this.loader.create({
      message: 'Logging in with Facebook...',
    });
    await loading.present();
    await this.auth
      .signInWithFacebook()
      .catch(async e => {
        console.error(e);
        loading.dismiss();
        const error = (e.code && e.message) ? `${e.code}: ${e.message}` : e;
        const alert = await this.alert.create({
          header: 'Error',
          subHeader: 'An error occurred while logging in with Facebook. If this error persists, please continue with email instead.',
          message: error,
          buttons: ['OK'],
        });
        alert.present();
        throw e;
      })
    await loading.dismiss();
  }

  forgotPassword() {
    this.navCtrl.navigateForward('/welcome/login/forgot-password');
    return false;
  }

  async signUp() {
    await this.navCtrl.pop();
    await this.navCtrl.navigateForward('/welcome/sign-up');
  }

  inputChange() {
    // Remove trailing and leading spaces from both email and password inputs
    // to prevent user from seeing 'invalid email' validation errors
    const { email } = this.loginForm.value;
    this.loginForm.patchValue({ email: email.trim() }, { emitEvent: false });
  }
}
