import { Component, OnInit } from '@angular/core';
import { NavController, ModalController } from '@ionic/angular';
import { StoryService } from 'src/services/story/story.service';
import { NewsfeedService } from 'src/services/newsfeed/newsfeed.service';
import { LoaderService } from 'src/services/utilities/loader.service';
import { PaymentMethodService } from 'src/services/payment/payment-method.service';
import { AlertService } from 'src/services/utilities/alert.service';
import { AuthService } from 'src/services/auth/auth.service';

@Component({
  selector: 'app-news-feed',
  templateUrl: './news-feed.component.html',
  styleUrls: ['./news-feed.component.scss'],
})
export class NewsFeedComponent implements OnInit {

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

  ngOnInit() {
    // TODO: Remove once newsfeed is fixed
    this.getUserStories();
  }

  async getUserStories() {
    const loading = await this.loader.create();
    await loading.present();
    try {
      await this.newsfeedService.initializeNewsfeed();
    } catch (e) {
      const alert = await this.alert.create({
        header: 'Network Error',
        message: e,
      });
      alert.present();
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

  openDetailedStory(storyId: number) {
    // this.navCtrl.navigateForward(
    //   'StoryPage',
    //   { storyId: storyId },
    //   { animate: true, direction: 'forward' }
    // );
  }

  async refresh(refresher: any) {
    await this.newsfeedService.initializeNewsfeed();
    refresher.complete();
  }

  async displayLikers(ticketId: number, storyId: number, numLikes: number) {
    if (numLikes > 0) {
      // const modal = await this.modalCtrl.create('LikesPage', {
      //   storyId: storyId,
      // });
      // modal.present();
    } else {
      await this.createLike(ticketId, storyId);
    }
  }

  displayUsers(users: any[]) {
    // const modal = await this.modalCtrl.create('UsersPage', {
    //   users: users,
    // });
    // modal.present();
  }
}
