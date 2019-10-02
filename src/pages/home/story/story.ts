import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ActionSheetController, ModalController } from 'ionic-angular';
import { StoryService } from '../../../services/story/story.service';
import moment from 'moment';
import { AuthService } from '../../../services/auth/auth.service';
import { IUser } from '../../../interfaces/user.interface';
import { NewsfeedService } from '../../../services/newsfeed/newsfeed.service';
import { LoaderService } from '../../../services/utilities/loader.service';
import { LikesPage } from '../likes/likes';
import { getStoryUsersDescription } from '../../../utilities/ticket.utilities';
import { UsersPage } from '../users/users';

@IonicPage()
@Component({
  selector: 'page-story',
  templateUrl: 'story.html',
})
export class StoryPage {

  story: any;
  comments: any[] = [];
  user = <IUser>{};
  newComment: string = '';
  newCommentPosting: boolean = false;
  userNamesDisplay: any = {};

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private storyService: StoryService,
    private authService: AuthService,
    private newsfeedService: NewsfeedService,
    public loader: LoaderService,
    public alertCtrl: AlertController,
    public auth: AuthService,
    private actionSheetCtrl: ActionSheetController,
    private modalCtrl: ModalController
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
      const storyId = await this.navParams.get('storyId');
      this.story = await this.storyService.getStory(storyId);
      await this.ticketUsersDescription(this.story.ticket.users, 3);
      await this.determineStoryLikedByUser();
      await this.getUserDetails();
      await this.getComments();
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

    if (res.status === 200) {

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

  /**
  * Returns an object to describe the users who have joined the tab.
  * Ex: Ray, Hassan, Sahil +3 others
  * @param users List of users
  * @param userDisplayLimit The max number of usernames to render. The rest of the users will be truncated and represented by "+x others", where x is the number of truncated users. Defaults to 3.
  */
  async ticketUsersDescription(users: any[] = [], userDisplayLimit: number) {
    this.userNamesDisplay = await getStoryUsersDescription(users, userDisplayLimit);
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
}
