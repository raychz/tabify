import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SelectItemsPage } from './select-items.page';

const routes: Routes = [
  {
    path: '',
    component: SelectItemsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SelectItemsPageRoutingModule {}
