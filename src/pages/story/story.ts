import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ActionSheetController } from 'ionic-angular';
import { StoryService } from '../../services/story/story.service';
import moment from 'moment';
import { AuthService } from '../../services/auth/auth.service';
import { IUser } from '../../interfaces/user.interface';
import { NewsfeedService } from '../../services/newsfeed/newsfeed.service';
import { LoaderService } from '../../services/utilities/loader.service';

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
  ) { }

  public ionViewCanEnter(): boolean {
    return this.auth.authenticated;
  }


  ionViewDidLoad() {
    this.getStory();
    this.getComments();
    this.getUserDetails();
  }

  async getStory() {
    this.loader.present();
    try {
      const storyId = await this.navParams.get('storyId');
      this.story = await this.storyService.getStory(storyId);
    } catch {
      const alert = this.alertCtrl.create({
        title: 'Network Error',
        message: `Please check your connection and try again.`,
      });
      alert.present();
    }
    this.loader.dismiss();
  }

  async getComments() {
    const storyId = await this.navParams.get('storyId');

    this.comments = await this.storyService.getComments(storyId);

    this.comments = this.comments.map((comment: any) => ({
      ...comment,
      relativeTime: moment(comment.date_created).fromNow(),
    }));

    console.log(this.comments);
  }

  async createLike() {
    this.story.loadingLike = true;
    const res = await this.storyService.createLike(this.story.id);

    if (res.status == 200) {

      // res.body = false means that the server created a new like
      if (res.body == false) {
        this.story.like_count += 1;

        // Increment comment count of story in newsfeed
        this.newsfeedService.incrementLikeCount(this.story.ticket.id, this.story.id);
      } else {
        this.story.like_count -= 1
        this.newsfeedService.decrementLikeCount(this.story.ticket.id, this.story.id);
      }
    }
    this.story.loadingLike = false;
  }

  async getUserDetails() {
    this.user.uid = this.authService.getUid();
    this.user.name = this.authService.getDisplayName();

    console.log(this.user);
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
