import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { FraudHeaderComponent } from './fraud-header.component';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
  ],
  declarations: [FraudHeaderComponent],
  exports: [FraudHeaderComponent],
})
export class FraudHeaderModule {}
