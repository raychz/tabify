import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AuthService } from '../../services/auth/auth.service';

@IonicPage()
@Component({
  selector: 'page-loading',
  templateUrl: 'loading.html',
})
export class LoadingPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public auth: AuthService) {
  }

  ionViewCanEnter() {
    return !this.auth.authenticated;
  }

  ionViewDidLoad() {
  }

}
