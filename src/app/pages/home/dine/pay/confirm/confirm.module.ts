import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ConfirmPageRoutingModule } from './confirm-routing.module';

import { ConfirmPage } from './confirm.page';
import { StatusModule } from '../../status/status.module';
import { FraudCodeComponent } from '../../fraud-code/fraud-code.component';
import { FraudCodeModule } from '../../fraud-code/fraud-code.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    StatusModule,
    ConfirmPageRoutingModule,
    FraudCodeModule,
  ],
  declarations: [ConfirmPage]
})
export class ConfirmPageModule {}
