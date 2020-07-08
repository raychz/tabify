import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SocializePage } from './socialize.page';
import { TabifyHeaderModule } from '../tabify-header/tabify-header.module';
import { SocializePageRoutingModule } from './socialize-routing.module';
import { UsersListComponent } from './users-list/users-list.component';
import { NewsFeedModule } from './news-feed/news-feed.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    TabifyHeaderModule,
    FormsModule,
    NewsFeedModule,
    SocializePageRoutingModule
  ],
  declarations: [SocializePage, UsersListComponent]
})
export class SocializePageModule {}
