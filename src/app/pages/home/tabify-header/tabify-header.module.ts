import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { TabifyHeaderComponent } from './tabify-header.component';
import { CommonModule } from '@angular/common';
import { MenuButtonModule } from '../menu-button/menu-button.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    MenuButtonModule,
  ],
  declarations: [TabifyHeaderComponent],
  exports: [TabifyHeaderComponent],
})
export class TabifyHeaderModule {}
