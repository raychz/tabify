import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AuthService } from '../../../../services/auth/auth.service';

@IonicPage()
@Component({
  selector: 'page-invite-others',
  templateUrl: 'invite-others.html',
})
export class InviteOthersPage {
  tabNumber: string;
  users: any[];


  constructor(public navCtrl: NavController, public navParams: NavParams, public auth: AuthService) {
    this.tabNumber = navParams.data.tabNumber;
    this.users = navParams.data.users;
  }

  public ionViewCanEnter(): boolean {
    return this.auth.authenticated;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad InviteOthersPage', this.navParams);
  }

}
