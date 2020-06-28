import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PayPage } from './pay.page';

const routes: Routes = [
  {
    path: ':ticketNumber',
    // component: PayPage,
    canActivate: [PayPage],
    canDeactivate: [PayPage],
    children: [
      {
        path: 'select',
        loadChildren: () => import('./select/select.module').then( m => m.SelectPageModule),
        // outlet: 'pay-routing'
      },
      {
        path: 'confirm',
        loadChildren: () => import('./confirm/confirm.module').then( m => m.ConfirmPageModule),
        // outlet: 'pay-routing'
      },
      {
        path: 'review',
        loadChildren: () => import('./review/review.module').then( m => m.ReviewPageModule),
        // outlet: 'pay-routing'
      },
      {
        path: '',
        redirectTo: 'select',
        pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PayPageRoutingModule {}
