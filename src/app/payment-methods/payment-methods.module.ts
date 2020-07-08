import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PaymentMethodsPageRoutingModule } from './payment-methods-routing.module';

import { PaymentMethodsPage } from './payment-methods.page';
import { PaymentMethodsListModule } from './payment-methods-list/payment-methods-list.module';
import { MenuButtonModule } from '../hamburger-menu/menu-button/menu-button.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PaymentMethodsPageRoutingModule,
    PaymentMethodsListModule,
    MenuButtonModule,
  ],
  declarations: [PaymentMethodsPage]
})
export class PaymentMethodsPageModule {}
