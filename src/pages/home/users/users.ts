import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { StoryService } from '../../../services/story/story.service';

@IonicPage()
@Component({
  selector: 'page-users',
  templateUrl: 'users.html',
})
export class UsersPage {

  users: any;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public storyService: StoryService
    ) {
    this.users = navParams.data.users;
  }
}
