import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { ILocation } from '../../interfaces/location.interface';
import { StoryService } from '../../services/story/story.service';
import { NewsfeedService } from '../../services/newsfeed/newsfeed.service';

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
    private storyService: StoryService,
    public newsfeedService: NewsfeedService
  ) { }

  ionViewDidLoad() {
    this.getUserStories();
  }

  async getUserStories() {
    await this.newsfeedService.initializeNewsfeed();
    console.log(this.newsfeedService.tickets);
  }

  async createLike(ticketId: number, storyId: number) {
    console.log(storyId);
    const res = await this.storyService.createLike(storyId);
    // do more stuff, like update the template with an additional like

    if (res.status === 200) {
      if (res.body === false) {

        // Increment comment count of story in newsfeed
        this.newsfeedService.incrementLikeCount(ticketId, storyId);

      } else {
        this.newsfeedService.decrementLikeCount(ticketId, storyId);
      }
    }
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
      { animate: true, direction: 'forward' }
    );
  }

  async refresh(refresher: any) {
    await this.newsfeedService.initializeNewsfeed();
    refresher.complete();
  }

  showNotifications() {
    this.navCtrl.push(
      'NotificationsPage',
      {},
      { animate: true, animation: 'md-transition', direction: 'forward' }
    );
  }
}
