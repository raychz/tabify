import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PaymentMethodsPageRoutingModule } from './payment-methods-routing.module';

import { PaymentMethodsPage } from './payment-methods.page';
import { MenuButtonModule } from '../menu-button/menu-button.module';
import { PaymentMethodsListModule } from './payment-methods-list/payment-methods-list.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PaymentMethodsPageRoutingModule,
    MenuButtonModule,
    PaymentMethodsListModule,
  ],
  declarations: [PaymentMethodsPage]
})
export class PaymentMethodsPageModule {}
