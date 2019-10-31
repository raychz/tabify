import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ActionSheetController, ModalController } from 'ionic-angular';
import { StoryService } from '../../../services/story/story.service';
import moment from 'moment';
import { AuthService } from '../../../services/auth/auth.service';
import { IUser } from '../../../interfaces/user.interface';
import { NewsfeedService } from '../../../services/newsfeed/newsfeed.service';
import { LoaderService } from '../../../services/utilities/loader.service';
import { getStoryUsersDescription, IUsersDescription } from '../../../utilities/ticket.utilities';
import { TicketItemService } from '../../../services/ticket-item/ticket-item.service';

@IonicPage()
@Component({
  selector: 'page-story',
  templateUrl: 'story.html',
})
export class StoryPage {

  selectedSegment = 'comments';
  story: any;
  comments: any[] = [];
  user = <IUser>{};
  ticketUsers: any[] = [];
  newComment: string = '';
  newCommentPosting: boolean = false;
  showMoreUsers: boolean = false;
  sharedItems: any = [];

  // This contains items in a ticket. Each items' users, 
  // and also payments for the associated ticket
  ticketUserPayments: any;
  organizedPayments: any[] = [];

  userNamesDisplay: IUsersDescription = {
    mainUsers: '',
    hereClause: '',
    othersNum: null
  };

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private storyService: StoryService,
    private authService: AuthService,
    private newsfeedService: NewsfeedService,
    public loader: LoaderService,
    public alertCtrl: AlertController,
    public auth: AuthService,
    public ticketItemService: TicketItemService,
    private actionSheetCtrl: ActionSheetController,
    private modalCtrl: ModalController,
  ) { }

  public ionViewCanEnter(): boolean {
    return this.auth.authenticated;
  }

  async ionViewDidLoad() {
    await this.getStory();
  }

  async getStory() {
    const loading = this.loader.create();
    await loading.present();
    try {
      await this.getUserDetails();
      const storyId = await this.navParams.get('storyId');
      this.story = await this.storyService.getStory(storyId);
      this.ticketUserPayments = await this.ticketItemService.getTicketItems(this.story.ticket.id);
      console.log(this.story);
      console.log(this.ticketUserPayments);
      this.userNamesDisplay = getStoryUsersDescription(this.story.ticket.users, 3);
      this.ticketUsers = this.ticketUserPayments.users;
      this.organizePaymentDetails();
      await this.determineStoryLikedByUser();
      await this.getComments();
      await this.getSharedItems();
    } catch {
      const alert = this.alertCtrl.create({
        title: 'Network Error',
        message: `Please check your connection and try again.`,
      });
      alert.present();
    }
    await loading.dismiss();

    return this.story;
  }

  async determineStoryLikedByUser() {
    const loggedInUserId = this.authService.getUid();

    for (let i = 0; i < this.story.likes.length; i++) {
      if (this.story.likes[i].user.uid === loggedInUserId) {
        this.story.likedByLoggedInUser = true;
        break;
      }
    }

    return this.story;
  }

  /**
   * organize item payments to make it digestable for the template. Organize by user
   */
  async organizePaymentDetails() {
    this.story.ticket.users.forEach(user => {
      user.items = [];
      user.payments = [];
      user.itemsVisible = false;
      this.organizedPayments.push(user);
    });

    for (let i = 0; i < this.organizedPayments.length; i++) {

      // organize payments
      for (let z = 0; z < this.ticketUserPayments.ticketPayments.length; z++) {
        if (this.ticketUserPayments.ticketPayments[z].user.uid === this.organizedPayments[i].uid) {
          this.organizedPayments[i].payments.push(this.ticketUserPayments.ticketPayments[z]);
        }
      }

      // organize items
      for (let y = 0; y < this.ticketUserPayments.items.length; y++) {

        for (let j = 0; j < this.ticketUserPayments.items[y].users.length; j++) {

          if (this.ticketUserPayments.items[y].users[j].uid === this.organizedPayments[i].uid) {
            this.organizedPayments[i].items.push(this.ticketUserPayments.items[y]);
          }
        }
      }
    }

    // move currently loggedIn user to the top
    // also set currently logged In users details open by default
    this.organizedPayments.forEach((payment, index) => {
      if (payment.uid === this.user.uid) {
        this.organizedPayments.splice(index, 1);
        this.organizedPayments.unshift(payment);
        this.organizedPayments[index].itemsVisible = true;
      }
    });



    console.log(this.organizedPayments);
    console.log(this.ticketUserPayments);
  }

  async getSharedItems() {
    // populate shared items
    this.ticketUserPayments.items.forEach(item => {
      if (item.users.length > 1) {
        this.sharedItems.push(item);
      }
    });

    console.log(this.sharedItems);
  }

  async getComments() {
    const storyId = await this.navParams.get('storyId');

    this.comments = await this.storyService.getComments(storyId);

    this.comments = this.comments.map((comment: any) => ({
      ...comment,
      relativeTime: moment(comment.date_created).fromNow(),
    }));

    return this.comments;
  }

  async createLike() {
    this.story.loadingLike = true;

    let res: any = {};

    res = await this.storyService.createLike(this.story.id);

    if (res.status === 201) {

      // res.likeCreated = true means that the server created a new like
      if (res.body && res.body.likeCreated === true) {

        const likeToBeAdded =
        {
          id: res.body.id,
          user: { uid: res.body.user.uid }
        };

        this.story.likes.push(likeToBeAdded);
        this.newsfeedService.addLike(this.story.ticket.id, this.story.id, likeToBeAdded);
        this.story.likedByLoggedInUser = true;
      } else {

        const loggedInUserId = this.auth.getUid();
        this.story.likes = this.story.likes.filter((like: any) => like.user.uid !== loggedInUserId);
        this.newsfeedService.removeLike(this.story.ticket.id, this.story.id);
        this.story.likedByLoggedInUser = false;
      }
    }
    this.story.loadingLike = false;
  }

  async getUserDetails() {
    this.user.uid = this.authService.getUid();
    this.user.name = this.authService.getDisplayName();
    return this.user;
  }

  async createComment() {
    this.newCommentPosting = true;

    try {
      const res = await this.storyService.createComment(this.story.id, this.newComment);
      const newComment: any = res.body;
      newComment.relativeTime = moment(newComment.date_created).fromNow()

      this.comments.push(newComment);

      // Increment comment count in detailed story view
      this.story.comment_count += 1;

      // Increment comment count of story in newsfeed
      this.newsfeedService.incrementCommentCount(this.story.ticket.id, this.story.id);

      this.newComment = '';
    } catch {
      const alert = this.alertCtrl.create({
        title: 'Network Error',
        message: `Please check your connection and try again.`,
      });
      alert.present();
    }

    this.newCommentPosting = false;
  }

  async deleteComment(commentId: number, commentIndex: number) {
    this.comments[commentIndex].beingDeleted = true;

    try {
      const res = await this.storyService.deleteComment(this.story.id, commentId);

      // remove the comment from front end
      this.comments.splice(commentIndex, 1);

      // Decrement comment count in detailed story view
      this.story.comment_count -= 1;

      // Decrement comment count of story in newsfeed
      this.newsfeedService.decrementCommentCount(this.story.ticket.id, this.story.id);
    } catch {
      const alert = this.alertCtrl.create({
        title: 'Network Error',
        message: `Please check your connection and try again.`,
      });
      alert.present();

      // if deletion of comment was unsuccessful, revert to comment not being deleted
      this.comments[commentIndex].beingDeleted = false;
    }
  }

  async displayLikers(numLikes: number) {
    if (numLikes > 0) {
      const modal = this.modalCtrl.create('LikesPage', {
        storyId: this.story.id,
      });
      modal.present();
    } else {
      await this.createLike();
    }
  }

  displayUsers(users: any[]) {
    const modal = this.modalCtrl.create('UsersPage', {
      users: users,
    });
    modal.present();
  }

  presentActionSheet(commentId: number, commentIndex: number) {
    const actionSheet = this.actionSheetCtrl.create({
      buttons: [
        {
          text: 'Delete Comment',
          role: 'destructive',
          icon: 'trash',
          handler: () => {
            this.deleteComment(commentId, commentIndex);
          },
        },
        {
          text: 'Cancel',
          role: 'cancel',
        },
      ],
    });
    actionSheet.present();
  }

  openTicketDetails() {
    this.navCtrl.push(
      'TicketDetailsPage',
      { ticketId: this.story.ticket.id },
      { animate: true, direction: 'forward' }
    );
  }

  segmentChanged(event: any) {
    this.selectedSegment = event.value;
  }
}
