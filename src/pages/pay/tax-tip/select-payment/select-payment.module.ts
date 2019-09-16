import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SelectPaymentPage } from './select-payment';

@NgModule({
  declarations: [
    SelectPaymentPage,
  ],
  imports: [
    IonicPageModule.forChild(SelectPaymentPage),
  ],
})
export class SelectPaymentPageModule {}
