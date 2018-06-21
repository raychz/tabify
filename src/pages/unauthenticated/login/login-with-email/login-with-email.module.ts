import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LoginWithEmailPage } from './login-with-email';
import { NgxErrorsModule } from '@ultimate/ngxerrors';

@NgModule({
  declarations: [
    LoginWithEmailPage,
  ],
  imports: [
    IonicPageModule.forChild(LoginWithEmailPage),
    NgxErrorsModule
  ],
})
export class LoginWithEmailPageModule {}
