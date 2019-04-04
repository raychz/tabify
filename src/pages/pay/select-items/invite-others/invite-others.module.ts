import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { InviteOthersPage } from './invite-others';

@NgModule({
  declarations: [
    InviteOthersPage,
  ],
  imports: [
    IonicPageModule.forChild(InviteOthersPage),
  ],
})
export class InviteOthersPageModule {}
