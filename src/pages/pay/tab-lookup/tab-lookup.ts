import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoaderService } from '../../../services/utilities/loader.service';
import { AuthService } from '../../../services/auth/auth.service';

@IonicPage()
@Component({
  selector: 'page-tab-lookup',
  templateUrl: 'tab-lookup.html',
})
export class TabLookupPage {
  location = this.navParams.data;
  tabForm: FormGroup;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public fb: FormBuilder,
    public loader: LoaderService,
    public auth: AuthService,
  ) {
    this.tabForm = fb.group({
      tabNumber: ['', Validators.compose([Validators.required])],
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TabLookupPage');
  }

  findTab() {
    const { tabNumber } = this.tabForm.value;
    this.loader.present();
    setTimeout(() => {
      this.loader.dismiss();
      this.navCtrl.push('SelectItemsPage', {
        tabNumber,
        displayName: this.auth.getDisplayName(),
        location: this.location
      });
    }, 300);
  }
}
