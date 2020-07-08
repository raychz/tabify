import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DinePage } from './dine.page';

const routes: Routes = [
    {
      path: '',
      // component: DinePage,
      canActivate: [DinePage],
    },
    {
      path: 'locations',
      loadChildren: () => import('./locations/locations.module').then(m => m.LocationsPageModule)
    },
    {
      path: ':locationSlug',
      component: DinePage,
      canActivate: [DinePage],
    },
    {
      path: ':locationSlug/pay',
      loadChildren: () => import('./pay/pay.module').then( m => m.PayPageModule)
    },
    {
      path: ':locationSlug/menu',
      loadChildren: () => import('./menu/menu.module').then( m => m.MenuPageModule)
    },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DinePageRoutingModule {}
