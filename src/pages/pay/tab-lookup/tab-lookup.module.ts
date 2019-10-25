import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TabLookupPage } from './tab-lookup';
import { NgxErrorsModule } from '@ultimate/ngxerrors';
import { SharedPayModule } from '../shared-pay.module'

@NgModule({
  declarations: [
    TabLookupPage,
  ],
  imports: [
    IonicPageModule.forChild(TabLookupPage),
    NgxErrorsModule,
    SharedPayModule
  ],
})
export class TabLookupPageModule {}
