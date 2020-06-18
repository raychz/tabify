import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PayPage } from './pay.page';

const routes: Routes = [
  {
    path: '',
    component: PayPage,
    children: [
      {
        path: 'select',
        loadChildren: () => import('./select/select.module').then( m => m.SelectPageModule)
      },
      {
        path: 'confirm',
        loadChildren: () => import('./confirm/confirm.module').then( m => m.ConfirmPageModule)
      },
      {
        path: 'review',
        loadChildren: () => import('./review/review.module').then( m => m.ReviewPageModule)
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
