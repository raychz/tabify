import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SocializePage } from './socialize.page';

const routes: Routes = [
  {
    path: '',
    component: SocializePage
  },
  {
    path: ':username',
    loadChildren: () => import('./user-profile/user-profile.module').then( m => m.UserProfilePageModule)
  },
  {
    path: 'story',
    loadChildren: () => import('./news-feed/story/story.module').then( m => m.StoryPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SocializePageRoutingModule {}
