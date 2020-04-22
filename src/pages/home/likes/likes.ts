import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from '@ionic/angular';
import { StoryService } from '../../../services/story/story.service';

@IonicPage()
@Component({
  selector: 'page-likes',
  templateUrl: 'likes.html',
})
export class LikesPage {

  storyId: number;
  story: any = {};

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public storyService: StoryService
    ) {
    this.storyId = navParams.data.storyId;
  }

  async ionViewDidLoad() {
    await this.getStoryLikers(this.storyId);
  }

  async getStoryLikers(storyId: number) {
    this.story = await this.storyService.getStoryLikers(storyId);
  }
}
