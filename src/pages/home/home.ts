import { Component } from '@angular/core';
import { IonicPage, NavController, AlertController } from 'ionic-angular';
import { ILocation } from '../../interfaces/location.interface';
import { LoaderService } from '../../services/utilities/loader.service';
import { PaymentService } from '../../services/payment/payment.service';
import { AlertService } from '../../services/utilities/alert.service';
import { StoryService } from '../../services/story/story.service';
import { NewsfeedService } from '../../services/newsfeed/newsfeed.service';
import { AuthService } from '../../services/auth/auth.service';
import { PaymentDetailsPageMode } from '../payment-methods/payment-details/payment-details';

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
}
