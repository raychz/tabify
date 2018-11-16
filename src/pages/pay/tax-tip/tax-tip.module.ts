import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TaxTipPage } from './tax-tip';
import { StarRatingModule } from 'ionic3-star-rating';

@NgModule({
  declarations: [
    TaxTipPage,
  ],
  imports: [
    IonicPageModule.forChild(TaxTipPage),
    StarRatingModule
  ],
})
export class TaxTipPageModule {}
