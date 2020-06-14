import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TaxTipPage } from './tax-tip.page';

const routes: Routes = [
  {
    path: '',
    component: TaxTipPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TaxTipPageRoutingModule {}
