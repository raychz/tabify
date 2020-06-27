import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TabLookupComponent } from './tab-lookup.component';
import { FraudCodeModule } from '../fraud-code/fraud-code.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FraudCodeModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  declarations: [TabLookupComponent],
  exports: [TabLookupComponent]
})
export class TabLookupModule {}
