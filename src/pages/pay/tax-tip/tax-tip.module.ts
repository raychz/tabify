import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TaxTipPage } from './tax-tip';

@NgModule({
  declarations: [
    TaxTipPage,
  ],
  imports: [
    IonicPageModule.forChild(TaxTipPage),
  ],
})
export class TaxTipPageModule {}
