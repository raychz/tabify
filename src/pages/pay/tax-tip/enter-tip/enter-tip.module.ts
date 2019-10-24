import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EnterTipPage } from './enter-tip';
import { SharedPayModule } from '../../shared_pay.module'

@NgModule({
  declarations: [
    EnterTipPage,
  ],
  imports: [
    IonicPageModule.forChild(EnterTipPage),
    SharedPayModule
  ],
})
export class EnterTipPageModule {}
