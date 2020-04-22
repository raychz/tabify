import { Component } from '@angular/core';
import { IonicPage, NavController, AlertController, ModalController } from '@ionic/angular';
import { Location } from '../../interfaces/location.interface';
import { LoaderService } from '../../services/utilities/loader.service';
import { PaymentMethodService } from '../../services/payment/payment-method.service';
import { AlertService } from '../../services/utilities/alert.service';
import { StoryService } from '../../services/story/story.service';
import { NewsfeedService } from '../../services/newsfeed/newsfeed.service';
import { AuthService } from '../../services/auth/auth.service';
import { PaymentDetailsPageMode } from '../payment-methods/payment-details/payment-details';

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
    public paymentMethodService: PaymentMethodService,
    public alert: AlertService,
    public auth: AuthService,
    public modalCtrl: ModalController
  ) { }

  public ionViewCanEnter(): boolean {
    return this.auth.authenticated;
  }

  ionViewDidLoad() {
    // TODO: Remove once newsfeed is fixed
    this.getUserStories();
  }

  async getUserStories() {
    const loading = this.loader.create();
    await loading.present();
    try {
      await this.newsfeedService.initializeNewsfeed();
    } catch (e) {
      const alert = this.alert.create({
        title: 'Network Error',
        message: e,
      });
      await alert.present();
      throw e;
    }
    await loading.dismiss();
  }

  async createLike(ticketId: number, storyId: number) {
    this.newsfeedService.loadingLike(ticketId, storyId, true);

    let res: any = {};

    res = await this.storyService.createLike(storyId);

    if (res.status === 201) {

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
    const loading = this.loader.create();
    await loading.present();
    try {
      const paymentMethods = await this.paymentMethodService.getPaymentMethods();

      // If user has a payment method on file, proceed to pay workflow
      // Otherwise, take user to payment method entry page
      if (paymentMethods && paymentMethods.length > 0) {
        await this.navCtrl.push(
          'LocationPage',
          {},
          { animate: true, animation: 'md-transition', direction: 'forward' }
        );
        await loading.dismiss();
      } else {
        const alert = this.alert.create({
          title: `Let's Get Started`,
          message: `To pay your tab, please enter a payment method.`,
          buttons: [
            {
              text: 'OK',
            },
          ],
        });
        await alert.present();
        await this.navCtrl.push(
          'PaymentMethodsPage',
          { mode: PaymentDetailsPageMode.NO_PAYMENT_METHOD },
          { animate: true, animation: 'md-transition', direction: 'forward' }
        );
        await loading.dismiss();
      }
    } catch (e) {
      await loading.dismiss();
      const alert = this.alert.create({
        title: 'Error',
        message: `Sorry, something went wrong. Please try again.`,
        buttons: [
          {
            text: 'OK',
          },
        ],
      });
      await alert.present();
      throw e;
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
}
