import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';

export interface Story {
  locationName: string;
  members: string[];
  timestamp;
  likes: number;
  comments: number;
}

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {
  selectedSegment = 'user';
  global = [];
  community = [];
  user = [];

  constructor(public navCtrl: NavController) {}

  segmentChanged(event) {
    console.log(event);
  }

  payNewTab() {
    this.navCtrl.push(
      'PayPage',
      {},
      { animate: true, animation: 'md-transition', direction: 'forward' }
    );
  }
}
