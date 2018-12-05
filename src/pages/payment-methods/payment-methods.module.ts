import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PaymentMethodsPage } from './payment-methods';

@NgModule({
  declarations: [
    PaymentMethodsPage,
  ],
  imports: [
    IonicPageModule.forChild(PaymentMethodsPage),
  ],
})
export class PaymentMethodsPageModule {}
