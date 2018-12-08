import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PaymentDetailsPage } from './payment-details';

@NgModule({
  declarations: [
    PaymentDetailsPage,
  ],
  imports: [
    IonicPageModule.forChild(PaymentDetailsPage),
  ],
})
export class PaymentDetailsPageModule {}
