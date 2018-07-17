import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TotalsPage } from './totals';

@NgModule({
  declarations: [
    TotalsPage,
  ],
  imports: [
    IonicPageModule.forChild(TotalsPage),
  ],
})
export class TotalsPageModule {}
