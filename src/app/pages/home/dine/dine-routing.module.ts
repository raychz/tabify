import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DinePage } from './dine.page';

const routes: Routes = [
    {
      path: '',
      // component: DinePage,
      canActivate: [DinePage],
    }, {
      path: ':locationSlug',
      component: DinePage,
      canActivate: [DinePage],
    },
    {
      path: ':locationSlug/pay',
      loadChildren: () => import('./pay/pay.module').then( m => m.PayPageModule)
    },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DinePageRoutingModule {}
