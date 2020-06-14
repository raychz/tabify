import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HelpTextComponent } from './help-text/help-text.component';
import { TabLookupComponent } from './tab-lookup.component';
import { FraudHeaderModule } from '../fraud-header/fraud-header.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FraudHeaderModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  declarations: [TabLookupComponent, HelpTextComponent],
  entryComponents: [HelpTextComponent],
  exports: [TabLookupComponent]
})
export class TabLookupModule {}
