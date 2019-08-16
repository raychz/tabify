import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AuthService } from '../../services/auth/auth.service';

@IonicPage()
@Component({
  selector: 'page-notifications',
  templateUrl: 'notifications.html',
})
export class NotificationsPage {
  constructor(public navCtrl: NavController, public navParams: NavParams, public auth: AuthService,) {}

  public ionViewCanEnter(): boolean {
    return this.auth.authenticated;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NotificationsPage');
  }

  cancel() {
    this.navCtrl.pop({
      animate: true,
      animation: 'md-transition',
      direction: 'back',
    });
  }
}
