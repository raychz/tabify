import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TabLookupPage } from './tab-lookup';

@NgModule({
  declarations: [
    TabLookupPage,
  ],
  imports: [
    IonicPageModule.forChild(TabLookupPage),
  ],
})
export class TabLookupPageModule {}
