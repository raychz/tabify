import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { StoryService } from '../../services/story/story.service';
import * as moment from 'moment';

@IonicPage()
@Component({
  selector: 'page-story',
  templateUrl: 'story.html',
})
export class StoryPage {

  story: any;
  comments: any = [];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private storyService: StoryService) { }

  ionViewDidLoad() {
    this.getStory();
    this.getComments();
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

  async createLike(storyId: number) {
    await this.storyService.createLike(storyId);
    // do more stuff, like update the template with an additional like
  }
}
