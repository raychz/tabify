import { Component } from '@angular/core';
import { IonicPage, NavController, AlertController, ModalController } from 'ionic-angular';
import { ILocation } from '../../interfaces/location.interface';
import { LoaderService } from '../../services/utilities/loader.service';
import { PaymentService } from '../../services/payment/payment.service';
import { AlertService } from '../../services/utilities/alert.service';
import { StoryService } from '../../services/story/story.service';
import { NewsfeedService } from '../../services/newsfeed/newsfeed.service';
import { AuthService } from '../../services/auth/auth.service';
import { PaymentDetailsPageMode } from '../payment-methods/payment-details/payment-details';
import { abbreviateName } from '../../utilities/general.utilities';
import { LikesPage } from './likes/likes';
import { getStoryUsersDescription } from '../../utilities/ticket.utilities';
import { UsersPage } from './users/users';

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
    public paymentService: PaymentService,
    public alert: AlertService,
    public auth: AuthService,
    public modalCtrl: ModalController
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
      const alert = this.alert.create({
        title: 'Network Error',
        message: e,
      });
      await alert.present();
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

  async payNewTab() {
    await this.loader.present();
    try {
      const paymentMethods = await this.paymentService.getPaymentMethods();

      // If user has a payment method on file, proceed to pay workflow
      // Otherwise, take user to payment method entry page
      if (paymentMethods && paymentMethods.length > 0) {
        await this.loader.dismiss();
        this.navCtrl.push(
          'LocationPage',
          {},
          { animate: true, animation: 'md-transition', direction: 'forward' }
        );
      } else {
        await this.loader.dismiss();
        const alert = this.alert.create({
          title: `Let's Get Started`,
          message: `To pay your tab, please enter a payment method.`,
          buttons: [
            {
              text: 'Ok',
            },
          ],
        });
        await alert.present();
        this.navCtrl.push(
          'PaymentMethodsPage',
          { mode: PaymentDetailsPageMode.NO_PAYMENT_METHOD },
          { animate: true, animation: 'md-transition', direction: 'forward' }
        );
      }
    } catch {
      await this.loader.dismiss();
      const alert = this.alert.create({
        title: 'Error',
        message: `Whoops, something went wrong. Please try again.`,
        buttons: [
          {
            text: 'Ok',
          },
        ],
      });
      await alert.present();
    }
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

  async displayLikers(ticketId: number, storyId: number, numLikes: number) {
    if (numLikes > 0) {
      const modal = this.modalCtrl.create('LikesPage', {
        storyId: storyId,
      });
      modal.present();
    } else {
      await this.createLike(ticketId, storyId);
    }
  }

  displayUsers(users: any[]) {
    const modal = this.modalCtrl.create('UsersPage', {
      users: users,
    });
    modal.present();
  }

  /**
  * Returns a string to describe the users who have joined the tab.
  * Ex: Ray, Hassan, Sahil +3 others
  * @param users List of users
  * @param userDisplayLimit The max number of usernames to render. The rest of the users will be truncated and represented by "+x others", where x is the number of truncated users. Defaults to 3.
  */
  ticketUsersDescription(users: any[] = [], userDisplayLimit: number = 3) {
    return getStoryUsersDescription(users, userDisplayLimit);
  }
}
