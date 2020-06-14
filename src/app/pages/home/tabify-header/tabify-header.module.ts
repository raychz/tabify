import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { TabifyHeaderComponent } from './tabify-header.component';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
  ],
  declarations: [TabifyHeaderComponent],
  exports: [TabifyHeaderComponent],
})
export class TabifyHeaderModule {}
