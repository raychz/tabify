import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SocializePage } from './socialize.page';
import { TabifyHeaderModule } from '../tabify-header/tabify-header.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    TabifyHeaderModule,
    FormsModule,
    RouterModule.forChild([{ path: '', component: SocializePage }])
  ],
  declarations: [SocializePage]
})
export class SocializePageModule {}
