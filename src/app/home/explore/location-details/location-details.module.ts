import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LocationDetailsPageRoutingModule } from './location-details-routing.module';

import { LocationDetailsPage } from './location-details.page';
import { GoogleMapsModule } from '@angular/google-maps';
import { NewsFeedModule } from '../../socialize/news-feed/news-feed.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GoogleMapsModule,
    NewsFeedModule,
    LocationDetailsPageRoutingModule
  ],
  declarations: [LocationDetailsPage]
})
export class LocationDetailsPageModule {}
