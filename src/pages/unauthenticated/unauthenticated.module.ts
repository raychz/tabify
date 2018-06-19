import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UnauthenticatedPage } from './unauthenticated';

@NgModule({
  declarations: [
    UnauthenticatedPage,
  ],
  imports: [
    IonicPageModule.forChild(UnauthenticatedPage),
  ],
})
export class UnauthenticatedPageModule {}
