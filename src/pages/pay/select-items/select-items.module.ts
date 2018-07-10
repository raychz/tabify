import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SelectItemsPage } from './select-items';

@NgModule({
  declarations: [
    SelectItemsPage,
  ],
  imports: [
    IonicPageModule.forChild(SelectItemsPage),
  ],
})
export class SelectItemsPageModule {}
