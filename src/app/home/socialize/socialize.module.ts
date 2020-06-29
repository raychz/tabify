import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SocializePage } from './socialize.page';
import { TabifyHeaderModule } from '../tabify-header/tabify-header.module';
import { SocializePageRoutingModule } from './socialize-routing.module';
import { NewsFeedComponent } from './news-feed/news-feed.component';
import { UsersListComponent } from './users-list/users-list.component';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    TabifyHeaderModule,
    FormsModule,
    SocializePageRoutingModule
  ],
  declarations: [SocializePage, NewsFeedComponent, UsersListComponent]
})
export class SocializePageModule {}
