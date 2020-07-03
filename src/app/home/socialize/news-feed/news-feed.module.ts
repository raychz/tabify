import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewsFeedComponent } from './news-feed.component';

@NgModule({
  imports: [
    IonicModule,
    CommonModule
  ],
  declarations: [NewsFeedComponent],
  exports: [NewsFeedComponent],
})
export class NewsFeedModule {}
