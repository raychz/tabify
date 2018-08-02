import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { Location } from '../pay/location/location';
import { user, global, community } from './example-stories';

export interface Story {
  location: Location;
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
  feeds = {
    user, community, global
  };

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

  refresh(refresher) {
    setTimeout(() => {
      refresher.complete();
    }, 2000);
  }
}
