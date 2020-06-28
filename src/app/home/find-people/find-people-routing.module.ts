import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FindPeoplePage } from './find-people.page';

const routes: Routes = [
  {
    path: '',
    component: FindPeoplePage
  },
  // ToDo: make user-profile be :username or :id
  {
    path: 'user-profile',
    loadChildren: () => import('./user-profile/user-profile.module').then( m => m.UserProfilePageModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FindPeoplePageRoutingModule {}
