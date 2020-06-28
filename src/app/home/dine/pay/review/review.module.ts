import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ReviewPageRoutingModule } from './review-routing.module';

import { ReviewPage } from './review.page';
import { StatusModule } from '../../status/status.module';
import { FraudCodeModule } from '../../fraud-code/fraud-code.module';
import { RatingComponent } from './rating/rating.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    StatusModule,
    FraudCodeModule,
    ReviewPageRoutingModule
  ],
  declarations: [ReviewPage, RatingComponent]
})
export class ReviewPageModule {}
