import { Component } from '@angular/core';
import { AlertController, IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../../services/auth/auth.service';
import { ErrorService } from '../../../../services/error/error.service';

@IonicPage({
  priority: 'off'
})
@Component({
  selector: 'page-forgot-password',
  templateUrl: 'forgot-password.html',
})
export class ForgotPasswordPage {
  forgotPasswordError: string = '';
  forgotPasswordForm: FormGroup;

  constructor(
    private alertCtrl: AlertController,
    public navCtrl: NavController,
    public navParams: NavParams,
    public fb: FormBuilder,
    private auth: AuthService,
    private errorService: ErrorService
  ) {
    this.forgotPasswordForm = fb.group({
      email: ['', Validators.compose([Validators.required, Validators.email])],
    });
  }

  ionViewCanEnter() {
    // Only allow unauthenticated users to enter this page
    return !this.auth.authenticated;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ForgotPasswordPage');
  }

  async sendPasswordResetEmail() {
    const { email } = this.forgotPasswordForm.value;
    if (email) {
      try {
        await this.auth.sendPasswordResetEmail(email)
        const alert = this.alertCtrl.create({
          title: 'Success',
          subTitle: `A password reset link has been sent to ${email}.`,
          buttons: ['OK']
        });
        alert.present();
        this.navCtrl.setRoot('UnauthenticatedPage');
      } catch (error) {
        this.forgotPasswordError = this.errorService.forgotPasswordError(error);
      }
    }
  }

  async signUp() {
    await this.navCtrl.setRoot('UnauthenticatedPage');
    await this.navCtrl.push('SignUpPage');
  }
}
