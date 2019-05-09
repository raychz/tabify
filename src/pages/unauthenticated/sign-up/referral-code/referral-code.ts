import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';

@IonicPage()
@Component({
  selector: 'page-referral-code',
  templateUrl: 'referral-code.html',
})
export class ReferralCodePage {
  referralCodeError: string = '';
  referralCodeForm: FormGroup;

  constructor(private alertCtrl: AlertController, public navCtrl: NavController, public navParams: NavParams, public fb: FormBuilder) {
    this.referralCodeForm = fb.group({
      referralCode: ['', Validators.compose([Validators.required, Validators.maxLength(5), Validators.minLength(5)])],
    });
  }

  ionViewDidLoad() {
  }

  submitReferralCode() {
    const { referralCode } = this.referralCodeForm.value;
    console.log("referralCode:", referralCode);
    this.navCtrl.push("SignUpPage", { referralCode });
  }

  onSkip() {
    this.navCtrl.push("SignUpPage");
  }

}