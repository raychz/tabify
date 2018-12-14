import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PaymentDetailsPage } from './payment-details';
import { PaymentService } from '../../../services/payment/payment.service';

@NgModule({
  declarations: [
    PaymentDetailsPage,
  ],
  imports: [
    IonicPageModule.forChild(PaymentDetailsPage),
  ],
  providers: [
    PaymentService
  ]
})
export class PaymentDetailsPageModule {}
