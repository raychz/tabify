import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { HomePageRoutingModule } from './home-routing.module';

import { HomePage } from './home.page';
import { TabifyHeaderModule } from './tabify-header/tabify-header.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    TabifyHeaderModule,
    HomePageRoutingModule,
  ],
  declarations: [HomePage],
})
export class HomePageModule {}
