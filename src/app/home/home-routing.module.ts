import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePage } from './home.page';

const routes: Routes = [
  {
    path: '',
    component: HomePage,
    canActivate: [HomePage],
    children: [
      {
        path: 'dine',
        loadChildren: () => import('./dine/dine.module').then(m => m.DinePageModule)
      },
      {
        path: 'explore',
        loadChildren: () => import('./explore/explore.module').then(m => m.ExploreModule)
      },
      {
        path: 'socialize',
        loadChildren: () => import('./socialize/socialize.module').then(m => m.SocializePageModule)
      },
      {
        path: '',
        redirectTo: 'dine',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: 'notifications',
    loadChildren: () => import('./notifications/notifications.module').then( m => m.NotificationsPageModule)
  },
  {
    path: 'payment-methods',
    loadChildren: () => import('./payment-methods/payment-methods.module').then( m => m.PaymentMethodsPageModule)
  },
  {
    path: 'help',
    loadChildren: () => import('./help/help.module').then( m => m.HelpPageModule)
  },
  {
    path: 'settings',
    loadChildren: () => import('./settings/settings.module').then( m => m.SettingsPageModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomePageRoutingModule {}
