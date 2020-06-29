import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HamburgerMenuPageRoutingModule } from './hamburger-menu-routing.module';

import { HamburgerMenuPage } from './hamburger-menu.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HamburgerMenuPageRoutingModule
  ],
  declarations: [HamburgerMenuPage]
})
export class HamburgerMenuPageModule {}
