import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePage } from './home.page';

const routes: Routes = [
  {
    path: 'home',
    component: HomePage,
    children: [
      {
        path: 'pay',
        children: [
          {
            path: '',
            loadChildren: () => import('./pay/pay.module').then(m => m.PayPageModule)
          },
          {
            path: 'select-items',
            loadChildren: () => import('./pay/select-items/select-items.module').then( m => m.SelectItemsPageModule)
          },
          {
            path: 'tax-tip',
            loadChildren: () => import('./pay/tax-tip/tax-tip.module').then( m => m.TaxTipPageModule)
          },
          {
            path: 'status',
            loadChildren: () => import('./pay/status/status.module').then( m => m.StatusPageModule)
          },
        ]
      },
      {
        path: 'explore',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('./explore/explore.module').then(m => m.ExploreModule)
          }
        ]
      },
      {
        path: 'activities',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('./activities/activities.module').then(m => m.ActivitesPageModule)
          }
        ]
      },
      {
        path: '',
        redirectTo: '/home/pay',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/home/pay',
    pathMatch: 'full'
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomePageRoutingModule {}
