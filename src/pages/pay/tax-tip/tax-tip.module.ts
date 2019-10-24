import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TaxTipPage } from './tax-tip';
import { Ionic2RatingModule } from "ionic2-rating";
import { SharedPayModule } from '../shared_pay.module'

@NgModule({
  declarations: [
    TaxTipPage,
  ],
  imports: [
    IonicPageModule.forChild(TaxTipPage),
    Ionic2RatingModule,
    SharedPayModule
  ],
})
export class TaxTipPageModule {

}
