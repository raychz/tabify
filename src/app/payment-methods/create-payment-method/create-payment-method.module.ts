import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CreatePaymentMethodPageRoutingModule } from './create-payment-method-routing.module';
import { CreatePaymentMethodPage } from './create-payment-method.page';
import { NgPaymentCardModule } from 'ng-payment-card';


@NgModule({
  imports: [
    CommonModule,
    NgPaymentCardModule,
    FormsModule,
    IonicModule,
    CreatePaymentMethodPageRoutingModule
  ],
  declarations: [CreatePaymentMethodPage]
})
export class CreatePaymentMethodPageModule {}