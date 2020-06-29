import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HamburgerMenuPage } from './hamburger-menu.page';

const routes: Routes = [
  {
    path: '',
    component: HamburgerMenuPage,
    children: [
      {
        path: 'home',
        loadChildren: () => import('../home/home.module').then(m => m.HomePageModule)
      },
      {
        path: 'auth',
        loadChildren: () => import('../auth/auth.module').then( m => m.AuthPageModule)
      },
      {
        path: 'payment-methods',
        loadChildren: () => import('../payment-methods/payment-methods.module').then( m => m.PaymentMethodsPageModule)
      },
      {
        path: 'help',
        loadChildren: () => import('../help/help.module').then( m => m.HelpPageModule)
      },
      {
        path: 'settings',
        loadChildren: () => import('../settings/settings.module').then( m => m.SettingsPageModule)
      },
      {
        path: '',
        redirectTo: 'auth',
        pathMatch: 'full'
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HamburgerMenuPageRoutingModule {}
