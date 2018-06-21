import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SignUpWithEmailPage } from './sign-up-with-email';
import { NgxErrorsModule } from '@ultimate/ngxerrors';

@NgModule({
  declarations: [
    SignUpWithEmailPage,
  ],
  imports: [
    IonicPageModule.forChild(SignUpWithEmailPage),
    NgxErrorsModule
  ],
})
export class SignUpWithEmailPageModule {}
