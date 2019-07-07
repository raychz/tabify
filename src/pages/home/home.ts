import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
// import { user, global, community } from './example-stories';
import { ILocation } from '../../interfaces/location.interface';
import { StoryService } from '../../services/story/story.service';
import * as moment from 'moment';

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
    user: [],
    community: [],
    global: [],
  };

  constructor(
    public navCtrl: NavController,
    private storyService: StoryService
  ) { }

  ionViewDidLoad() {
    this.getUserStories();
  }

  async getUserStories() {
    const userStories = await this.storyService.getUserStories();

    this.feeds.user = userStories.map((story: any) => ({
      ...story,
      relativeTime: moment(story.ticket.date_created).fromNow()
    }));
  }

  async createLike(storyId: number) {
    await this.storyService.createLike(storyId);
    // do more stuff, like update the template with an additional like
  }

  segmentChanged(event: any) {
    console.log(event);
  }

  payNewTab() {
    this.navCtrl.push(
      'PayPage',
      {},
      { animate: true, animation: 'md-transition', direction: 'forward' }
    );
  }

  openDetailedStory(storyId: number) {
    this.navCtrl.push(
      'StoryPage',
      { storyId: storyId },
      { animate: true, animation: 'md-transition', direction: 'forward' }
    );
  }

  refresh(refresher: any) {
    setTimeout(() => {
      refresher.complete();
    }, 2000);
  }

  showNotifications() {
    this.navCtrl.push(
      'NotificationsPage',
      {},
      { animate: true, animation: 'md-transition', direction: 'forward' }
    );
  }
}
