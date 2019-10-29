import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SelectItemsPage } from './select-items';
import { SharedPayModule } from '../shared-pay.module'

@NgModule({
  declarations: [
    SelectItemsPage,
  ],
  imports: [
    IonicPageModule.forChild(SelectItemsPage),
    SharedPayModule
  ],
})
export class SelectItemsPageModule {}
