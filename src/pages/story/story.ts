import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { StoryService } from '../../services/story/story.service';
import * as moment from 'moment';
import { AuthService } from '../../services/auth/auth.service';
import { IUser } from '../../interfaces/user.interface';

@IonicPage()
@Component({
  selector: 'page-story',
  templateUrl: 'story.html',
})
export class StoryPage {

  story: any;
  comments: any = [];
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

    this.story.relativeTime = moment(this.story.ticket.date_created).fromNow();

    console.log(this.story);
  }

  async getComments() {
    const storyId = await this.navParams.get('storyId');

    this.comments = await this.storyService.getComments(storyId);

    console.log(this.comments);
  }

  async createLike() {
    await this.storyService.createLike(this.story.id);
    // do more stuff, like update the template with an additional like
  }

  // async createComment(storyId: number, uid: number, newComment: string) {
  //   await this.storyService.createComment(storyId, uid, newComment);
  // }

  async getUserDetails() {
    this.user.uid = this.authService.getUid();
    this.user.name = this.authService.getDisplayName();

    console.log(this.user);
  }

  async createComment() {
    const res = await this.storyService.createComment(this.story.id, this.newComment);

    if (res == 201) {
      let newCommentId = this.comments[this.comments.length - 1].id + 1

      let user = {uid: this.user.uid};
      let comment = {id: newCommentId, text: this.newComment, user};

      this.comments.push(comment);
    }

    this.newComment = '';
  }
}
