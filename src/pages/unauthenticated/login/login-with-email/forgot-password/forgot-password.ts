import { Component } from '@angular/core';
import { AlertController, IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../../../services/auth.service';

@IonicPage()
@Component({
  selector: 'page-forgot-password',
  templateUrl: 'forgot-password.html',
})
export class ForgotPasswordPage {
  forgotPasswordError: string;
  forgotPasswordForm: FormGroup;

  constructor(private alertCtrl: AlertController, public navCtrl: NavController, public navParams: NavParams, private fb: FormBuilder, private auth: AuthService) {
    this.forgotPasswordForm = fb.group({
      email: ['', Validators.compose([Validators.required, Validators.email])],
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ForgotPasswordPage');
  }

  sendPasswordResetEmail() {
    const { email } = this.forgotPasswordForm.value;
    if (email) {
      this.auth.sendPasswordResetEmail(email)
        .then(
          () => {
            const alert = this.alertCtrl.create({
              title: 'Success',
              subTitle: 'A password reset link has been sent to your email.',
              buttons: ['Ok']
            });
            this.navCtrl.setRoot('UnauthenticatedPage').then(() => alert.present());
          },
          error => this.forgotPasswordError = error.message
        );
    }
  }

}
