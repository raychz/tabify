import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { StoryService } from '../../services/story/story.service';
import moment from 'moment';
import { AuthService } from '../../services/auth/auth.service';
import { IUser } from '../../interfaces/user.interface';
import { NewsfeedService } from '../../services/newsfeed/newsfeed.service';

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

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private storyService: StoryService,
    private authService: AuthService,
    private newsfeedService: NewsfeedService
  ) { }

  ionViewDidLoad() {
    this.getStory();
    this.getComments();
    this.getUserDetails();
  }

  async getStory() {
    const storyId = await this.navParams.get('storyId');
    this.story = await this.storyService.getStory(storyId);
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
    const res = await this.storyService.createLike(this.story.id);
    // do more stuff, like update the template with an additional like

    console.log(res);

    if (res.status == 200) {
      if (res.body == false) {
        this.story.like_count += 1;

        // Increment comment count of story in newsfeed
        this.newsfeedService.incrementLikeCount(this.story.ticket.id, this.story.id);

      } else {
        this.story.like_count -= 1

        this.newsfeedService.decrementLikeCount(this.story.ticket.id, this.story.id);
      }
    }
  }

  async getUserDetails() {
    this.user.uid = this.authService.getUid();
    this.user.name = this.authService.getDisplayName();

    console.log(this.user);
  }

  async createComment() {
    const res = await this.storyService.createComment(this.story.id, this.newComment);

    console.log(res);

    if (res.status === 200) {
      const newComment: any = res.body;

      newComment.relativeTime = moment(newComment.date_created).fromNow()

      this.comments.push(newComment);

      // Increment comment count in detailed story view
      this.story.comment_count += 1;

      // Increment comment count of story in newsfeed
      this.newsfeedService.incrementCommentCount(this.story.ticket.id, this.story.id);
    }

    this.newComment = '';
  }

  async deleteComment(commentId: number) {
    const res = await this.storyService.deleteComment(this.story.id, commentId);

    if (res.status === 200) {
      // remove the comment from front end
      const index = this.comments.findIndex((comment: any) => comment.id === commentId);
      this.comments.splice(index, 1);

      // Decrement comment count in detailed story view
      this.story.comment_count -= 1;

      // Decrement comment count of story in newsfeed
      this.newsfeedService.decrementCommentCount(this.story.ticket.id, this.story.id);
    }
  }
}
