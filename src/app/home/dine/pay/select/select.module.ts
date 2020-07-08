import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SelectPageRoutingModule } from './select-routing.module';

import { SelectPage } from './select.page';
import { StatusModule } from '../../status/status.module';
import { FraudCodeModule } from '../../fraud-code/fraud-code.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    StatusModule,
    FraudCodeModule,
    SelectPageRoutingModule
  ],
  declarations: [SelectPage]
})
export class SelectPageModule {}
