import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EnterTipPage } from './enter-tip';

@NgModule({
  declarations: [
    EnterTipPage,
  ],
  imports: [
    IonicPageModule.forChild(EnterTipPage),
  ],
})
export class EnterTipPageModule {}
