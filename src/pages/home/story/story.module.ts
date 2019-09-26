import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { StoryPage } from './story';
import { Ionic2RatingModule } from "ionic2-rating";

@NgModule({
  declarations: [
    StoryPage,
  ],
  imports: [
    IonicPageModule.forChild(StoryPage),
    Ionic2RatingModule
  ],
})
export class StoryPageModule {}
