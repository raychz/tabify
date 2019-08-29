import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LikesPage } from './likes';

@NgModule({
  declarations: [
    LikesPage,
  ],
  imports: [
    IonicPageModule.forChild(LikesPage),
  ],
})
export class LikesPageModule {}
