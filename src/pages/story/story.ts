import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { StoryService } from '../../services/story/story.service';
import moment from 'moment';
import { AuthService } from '../../services/auth/auth.service';
import { IUser } from '../../interfaces/user.interface';

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
    private authService: AuthService) { }

  ionViewDidLoad() {
    this.getStory();
    this.getComments();
    this.getUserDetails();
  }

  async getStory() {
    const storyId = await this.navParams.get('storyId');
    this.story = await this.storyService.getStory(storyId);
    this.story.timeStamp = moment(this.story.ticket.date_created).format('MMMM Do YYYY, h:mm a');

    console.log(this.story);
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
    await this.storyService.createLike(this.story.id);
    // do more stuff, like update the template with an additional like
  }

  async getUserDetails() {
    this.user.uid = this.authService.getUid();
    this.user.name = this.authService.getDisplayName();

    console.log(this.user);
  }

  async createComment() {
    const res = await this.storyService.createComment(this.story.id, this.newComment);

    console.log(res);
    
    if (res.status == 200) {
      const newComment: any = res.body;

      newComment.relativeTime = moment(newComment.date_created).fromNow()

      this.comments.push(newComment);
      this.story.comment_count += 1;
    }

    this.newComment = '';
    console.log(this.comments);
  }

  async deleteComment(commentId: number) {
    const res = await this.storyService.deleteComment(this.story.id, commentId);

    if (res.status == 200) { 
      // remove the comment from front end
      const index = this.comments.findIndex((comment: any) => comment.id === commentId);
      this.comments.splice(index, 1);
      this.story.comment_count -= 1;
    }
  }
}
