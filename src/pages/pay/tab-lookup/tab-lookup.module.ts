import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TabLookupPage } from './tab-lookup';
import { NgxErrorsModule } from '@ultimate/ngxerrors';

@NgModule({
  declarations: [
    TabLookupPage,
  ],
  imports: [
    IonicPageModule.forChild(TabLookupPage),
    NgxErrorsModule
  ],
})
export class TabLookupPageModule {}
