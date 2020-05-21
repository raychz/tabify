import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TaxTipPageRoutingModule } from './tax-tip-routing.module';

import { TaxTipPage } from './tax-tip.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TaxTipPageRoutingModule
  ],
  declarations: [TaxTipPage]
})
export class TaxTipPageModule {}
