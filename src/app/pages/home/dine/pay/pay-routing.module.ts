import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PayPage } from './pay.page';

const routes: Routes = [
  {
    path: '',
    component: PayPage,
    children: [
      {
        path: 'select-items',
        loadChildren: () => import('./select-items/select-items.module').then( m => m.SelectItemsPageModule)
      },
      {
        path: 'tax-tip',
        loadChildren: () => import('./tax-tip/tax-tip.module').then( m => m.TaxTipPageModule)
      },
      {
        path: 'review',
        loadChildren: () => import('./review/review.module').then( m => m.ReviewPageModule)
      },
      {
        path: '',
        redirectTo: 'select-items',
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
