import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { FraudCodeComponent } from './fraud-code.component';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
  ],
  declarations: [FraudCodeComponent],
  exports: [FraudCodeComponent],
})
export class FraudCodeModule {}
