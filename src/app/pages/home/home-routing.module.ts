import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePage } from './home.page';

const routes: Routes = [
  {
    path: '',
    component: HomePage,
    children: [
      {
        path: 'pay',
        loadChildren: () => import('./pay/pay.module').then(m => m.PayPageModule)
      },
      {
        path: 'explore',
        loadChildren: () => import('./explore/explore.module').then(m => m.ExploreModule)
      },
      {
        path: 'activities',
        loadChildren: () => import('./activities/activities.module').then(m => m.ActivitesPageModule)
      },
      {
        path: '',
        redirectTo: 'pay',
        pathMatch: 'full'
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomePageRoutingModule {}
