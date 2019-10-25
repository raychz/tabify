import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SelectPaymentPage } from './select-payment';
import { SharedPayModule } from '../../shared-pay.module'


@NgModule({
  declarations: [
    SelectPaymentPage,
  ],
  imports: [
    IonicPageModule.forChild(SelectPaymentPage),
    SharedPayModule
  ],
})
export class SelectPaymentPageModule {}
