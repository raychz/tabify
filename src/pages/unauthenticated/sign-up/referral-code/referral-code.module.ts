import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ReferralCodePage } from './referral-code';
import { NgxErrorsModule } from '@ultimate/ngxerrors';

@NgModule({
  declarations: [
    ReferralCodePage,
  ],
  imports: [
    IonicPageModule.forChild(ReferralCodePage),
    NgxErrorsModule
  ],
})
export class ReferralCodePageModule {}
