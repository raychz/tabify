import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PaymentMethodsPage } from './payment-methods.page';

const routes: Routes = [
  {
    path: '',
    component: PaymentMethodsPage
  },
  {
    path: 'create',
    loadChildren: () => import('./create-payment-method/create-payment-method.module').then( m => m.CreatePaymentMethodPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PaymentMethodsPageRoutingModule {}
