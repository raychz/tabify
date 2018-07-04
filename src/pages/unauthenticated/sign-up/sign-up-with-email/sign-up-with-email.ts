import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../../services/auth/auth.service';

@IonicPage({
  priority: 'high'
})
@Component({
  selector: 'page-sign-up-with-email',
  templateUrl: 'sign-up-with-email.html',
})
export class SignUpWithEmailPage {
  signUpError: string;
  form: FormGroup;

  constructor(fb: FormBuilder, private navCtrl: NavController, private auth: AuthService) {
    this.form = fb.group({
      email: ['', Validators.compose([Validators.required, Validators.email])],
      password: ['', Validators.compose([Validators.required, Validators.minLength(6)])]
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SignUpWithEmailPage');
  }

  signUp() {
    let data = this.form.value;
    let credentials = {
      email: data.email,
      password: data.password
    };
    this.auth.signUp(credentials).then(
      () => this.navCtrl.setRoot('HomePage'),
      error => {
        console.log("ERROR", error);
        this.signUpError = error.message
      }
    );
  }
}
