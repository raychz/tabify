import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-find-people',
  templateUrl: './find-people.page.html',
  styleUrls: ['./find-people.page.scss'],
})
export class FindPeoplePage implements OnInit {

  constructor(
    public navCtrl: NavController,
  ) { }

  ngOnInit() {
  }

  public userProfile() {
    this.navCtrl.navigateForward('home/socialize/find-people/user-profile');
  }
}
