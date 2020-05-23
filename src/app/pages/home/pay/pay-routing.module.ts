import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PayPage } from './pay.page';

const routes: Routes = [
    {
      path: '',
      component: PayPage,

    },
    {
      path: 'select-items',
      loadChildren: () => import('./select-items/select-items.module').then( m => m.SelectItemsPageModule)
    },
    {
      path: 'tax-tip',
      loadChildren: () => import('./tax-tip/tax-tip.module').then( m => m.TaxTipPageModule)
    },
    {
      path: 'status',
      loadChildren: () => import('./status/status.module').then( m => m.StatusPageModule)
    },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PayPageRoutingModule {}
