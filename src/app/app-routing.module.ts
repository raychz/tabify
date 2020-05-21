import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./pages/home/home.module').then(m => m.HomePageModule)
  },
  {
    path: 'welcome',
    loadChildren: () => import('./pages/welcome/welcome.module').then( m => m.WelcomePageModule)
  },
  {
    path: 'loading',
    loadChildren: () => import('./pages/loading/loading.module').then( m => m.LoadingPageModule)
  },  {
    path: 'select-items',
    loadChildren: () => import('./src/app/pages/home/pay/select-items/select-items.module').then( m => m.SelectItemsPageModule)
  },
  {
    path: 'confirm',
    loadChildren: () => import('./src/app/pages/home/pay/confirm/confirm.module').then( m => m.ConfirmPageModule)
  },
  {
    path: 'status',
    loadChildren: () => import('./src/app/pages/home/pay/status/status.module').then( m => m.StatusPageModule)
  },
  {
    path: 'select-items',
    loadChildren: () => import('./app/pages/home/pay/select-items/select-items.module').then( m => m.SelectItemsPageModule)
  },
  {
    path: 'select-items',
    loadChildren: () => import('./home/pay/select-items/select-items.module').then( m => m.SelectItemsPageModule)
  }

];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
