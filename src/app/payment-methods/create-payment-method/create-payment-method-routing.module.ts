import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CreatePaymentMethodPage } from './create-payment-method.page';

const routes: Routes = [
  {
    path: '',
    component: CreatePaymentMethodPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CreatePaymentMethodPageRoutingModule {}
