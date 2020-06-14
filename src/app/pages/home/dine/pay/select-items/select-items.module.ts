import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SelectItemsPageRoutingModule } from './select-items-routing.module';

import { SelectItemsPage } from './select-items.page';
import { StatusModule } from '../../status/status.module';
import { FraudHeaderModule } from '../../fraud-header/fraud-header.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    StatusModule,
    FraudHeaderModule,
    SelectItemsPageRoutingModule
  ],
  declarations: [SelectItemsPage]
})
export class SelectItemsPageModule {}
