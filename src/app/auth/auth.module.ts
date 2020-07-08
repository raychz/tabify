import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AuthPageRoutingModule } from './auth-routing.module';

import { AuthPage } from './auth.page';
import { MenuButtonModule } from '../hamburger-menu/menu-button/menu-button.module';
import { TabifyHeaderModule } from '../home/tabify-header/tabify-header.module';

@NgModule({
  imports: [
    CommonModule,
    TabifyHeaderModule,
    FormsModule,
    IonicModule,
    AuthPageRoutingModule
  ],
  declarations: [AuthPage]
})
export class AuthPageModule {}
