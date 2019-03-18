import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { user, global, community } from './example-stories';
import { ILocation } from '../../interfaces/location.interface';

export interface Story {
  location: ILocation;
  members: string[];
  timestamp: number | string;
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

  segmentChanged(event: any ) {
    console.log(event);
  }

  payNewTab() {
    this.navCtrl.push(
      'PayPage',
      {},
      { animate: true, animation: 'md-transition', direction: 'forward' }
    );
  }

  refresh(refresher: any) {
    setTimeout(() => {
      refresher.complete();
    }, 2000);
  }
}
