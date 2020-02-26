import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FraudPreventionPage } from './fraud-prevention';
import { SharedPayModule } from '../shared-pay.module'

@NgModule({
  declarations: [
    FraudPreventionPage,
  ],
  imports: [
    IonicPageModule.forChild(FraudPreventionPage),
    SharedPayModule
  ],
})
export class FraudPreventionModule {}
