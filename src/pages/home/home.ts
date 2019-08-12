import { Component } from '@angular/core';
import { IonicPage, NavController, AlertController } from 'ionic-angular';
import { ILocation } from '../../interfaces/location.interface';
import { StoryService } from '../../services/story/story.service';
import { NewsfeedService } from '../../services/newsfeed/newsfeed.service';
import { LoaderService } from '../../services/utilities/loader.service';

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
    public newsfeedService: NewsfeedService,
    public loader: LoaderService,
    public alertCtrl: AlertController
  ) { }

  ionViewDidLoad() {
    this.getUserStories();
  }

  async getUserStories() {
    this.loader.present();
    try {
      await this.newsfeedService.initializeNewsfeed();
    } catch {
      const alert = this.alertCtrl.create({
        title: 'Network Error',
        message: `Please check your connection and try again.`,
      });
      alert.present();
    }
    this.loader.dismiss();
  }

  async createLike(ticketId: number, storyId: number) {
    this.newsfeedService.changingLikeTrue(ticketId, storyId);
    const res = await this.storyService.createLike(storyId);

    if (res.status === 200) {

      // res.body = false means that the server created a new like
      if (res.body === false) {

        // Increment comment count of story in newsfeed
        this.newsfeedService.incrementLikeCount(ticketId, storyId);

      } else {
        this.newsfeedService.decrementLikeCount(ticketId, storyId);
      }
    }
    this.newsfeedService.changingLikeFalse(ticketId, storyId);
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
