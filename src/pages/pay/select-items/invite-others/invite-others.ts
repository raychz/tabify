import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-invite-others',
  templateUrl: 'invite-others.html',
})
export class InviteOthersPage {
  tabNumber: string;
  users: any[];


  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.tabNumber = navParams.data.tabNumber;
    this.users = navParams.data.users;
   }

  ionViewDidLoad() {
    console.log('ionViewDidLoad InviteOthersPage', this.navParams);
  }

}
