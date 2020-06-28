import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaymentMethodsListComponent } from './payment-methods-list.component';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
  ],
  declarations: [PaymentMethodsListComponent],
  exports: [PaymentMethodsListComponent]
})
export class PaymentMethodsListModule {}
