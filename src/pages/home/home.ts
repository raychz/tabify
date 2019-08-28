import { Component } from '@angular/core';
import { IonicPage, NavController, AlertController } from 'ionic-angular';
import { ILocation } from '../../interfaces/location.interface';
import { StoryService } from '../../services/story/story.service';
import { NewsfeedService } from '../../services/newsfeed/newsfeed.service';
import { LoaderService } from '../../services/utilities/loader.service';
import { AuthService } from '../../services/auth/auth.service';

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
    public alertCtrl: AlertController,
    public auth: AuthService,
  ) { }

  public ionViewCanEnter(): boolean {
    return this.auth.authenticated;
  }

  ionViewDidLoad() {
    this.getUserStories();
  }

  async getUserStories() {
    this.loader.present();
    try {
      await this.newsfeedService.initializeNewsfeed();
    } catch (e) {
      const alert = this.alertCtrl.create({
        title: 'Network Error',
        message: e,
      });
      alert.present();
    }
    this.loader.dismiss();
  }

  async createLike(ticketId: number, storyId: number) {
    this.newsfeedService.loadingLike(ticketId, storyId, true);

    let res: any = {};

    res = await this.storyService.createLike(storyId);

    if (res.status === 200) {

      // res.likeCreated = true means that the server created a new like
      if (res.body && res.body.likeCreated === true) {

        const likeToBeAdded =
        {
          id: res.body.id,
          user: { uid: res.body.user.uid }
        };

        this.newsfeedService.addLike(ticketId, storyId, likeToBeAdded);

      } else {
        this.newsfeedService.removeLike(ticketId, storyId);
      }
    }
    this.newsfeedService.loadingLike(ticketId, storyId, false);
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

  /**
 * Returns a string to describe the users who have joined the tab.
 * Ex: Ray, Hassan, Sahil +3 others
 * @param users List of users
 * @param userDisplayLimit The max number of usernames to render. The rest of the users will be truncated and represented by "+x others", where x is the number of truncated users. Defaults to 3.
 */
  getTicketUsersDescription(users: any[] = [], userDisplayLimit: number = 3) {
    if (!users || users.length === 0) return 'No users on this tab.';

    let hereClause = '';

    if (users.length > 1) {
      hereClause = 'were here'
    } else {
      hereClause = 'was here'
    }

    const abbreviatedNames = users.map(user => this.abbreviateName(user.userDetail.displayName));

    if (abbreviatedNames.length > userDisplayLimit) {
      const overflowNames = abbreviatedNames.splice(userDisplayLimit);
      const others = `+${overflowNames.length} other${
        overflowNames.length > 1 ? 's' : ''
        }`;
      return `${abbreviatedNames.join(', ')} ${others} ${hereClause}`;
    }
    return `${abbreviatedNames.join(', ')} ${hereClause}`;
  }

  /**
 * Abbreviates a user's name. Ex: `abbreviateName('Raymond Chavez')` => `'Raymond C.'`
 * @param name 
 */
  abbreviateName(name: string) {
    const nameSplit: string[] = name.split(' ');
    const firstName = nameSplit.shift();
    const rest = nameSplit.map(v => `${v[0].toUpperCase()}.`).join('');
    return `${firstName} ${rest}`;
  };
}
