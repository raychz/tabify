import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { StatusComponent } from './status.component';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [
    IonicModule,
    CommonModule
  ],
  declarations: [StatusComponent],
  exports: [StatusComponent],
})
export class StatusModule {}
