import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { ILocation } from '../../interfaces/location.interface';
import { LoaderService } from '../../services/utilities/loader.service';
import { PaymentService } from '../../services/payment/payment.service';
import { AlertService } from '../../services/utilities/alert.service';
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
    public newsfeedService: NewsfeedService,
    public loader: LoaderService, 
    public paymentService: PaymentService, 
    public alert: AlertService,
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

  async payNewTab() {
    await this.loader.present();
    try {
      const paymentMethods = await this.paymentService.getPaymentMethods();

      // If user has a payment method on file, proceed to pay workflow
      // Otherwise, take user to payment method entry page
      if (paymentMethods && paymentMethods.length > 0) {
        await this.loader.dismiss();
        this.navCtrl.push(
          'PayPage',
          {},
          { animate: true, animation: 'md-transition', direction: 'forward' }
        );
      } else {
        await this.loader.dismiss();
        const alert = this.alert.create({
          title: 'No Payment Method',
          message: `To get started with paying your tab, enter a payment method on the next screen.`,
          buttons: [
            {
              text: 'Ok',
            },
          ],
        });
        await alert.present();
        this.navCtrl.push(
          'PaymentMethodsPage',
          {},
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
