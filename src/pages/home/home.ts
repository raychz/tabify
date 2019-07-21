import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
// import { user, global, community } from './example-stories';
import { ILocation } from '../../interfaces/location.interface';
import { StoryService } from '../../services/story/story.service';
import moment from 'moment';
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
    // const userStories = await this.storyService.getUserStories();

    // this.feeds.user = userStories.map((story: any) => ({
    //   ...story,
    //   timeStamp: moment(story.ticket.date_created).format('MMMM Do YYYY, h:mm a'),
    // }));

    // console.log(this.feeds.user);
    await this.newsfeedService.initializeStories();
    console.log('date night', this.newsfeedService.stories);
  }

  async createLike(storyId: number) {
    const response = await this.storyService.createLike(storyId);
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
      { animate: true, direction: 'forward' }
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
