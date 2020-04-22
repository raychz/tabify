import { NgModule } from '@angular/core';
import { IonicPageModule } from '@ionic/angular';
import { PayConfirmationPage } from './pay-confirmation';

@NgModule({
  declarations: [
    PayConfirmationPage,
  ],
  imports: [
    IonicPageModule.forChild(PayConfirmationPage),
  ],
})
export class PayConfirmationPageModule {}
