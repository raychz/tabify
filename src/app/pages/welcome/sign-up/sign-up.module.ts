import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SignUpPageRoutingModule } from './sign-up-routing.module';

import { SignUpPage } from './sign-up.page';
import { NgxErrorsModule } from '@ultimate/ngxerrors';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    NgxErrorsModule,
    SignUpPageRoutingModule,
    IonicModule,
  ],
  declarations: [SignUpPage]
})
export class SignUpPageModule {}
