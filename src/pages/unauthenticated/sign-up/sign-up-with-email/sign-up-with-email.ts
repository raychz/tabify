import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../../services/auth/auth.service';

@IonicPage({
  priority: 'high',
})
@Component({
  selector: 'page-sign-up-with-email',
  templateUrl: 'sign-up-with-email.html',
})
export class SignUpWithEmailPage {
  signUpError: string = '';
  form: FormGroup;

  constructor(
    fb: FormBuilder,
    private navCtrl: NavController,
    private auth: AuthService
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
}
