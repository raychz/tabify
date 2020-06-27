import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuButtonComponent } from './menu-button.component';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
  ],
  declarations: [MenuButtonComponent],
  exports: [MenuButtonComponent]
})
export class MenuButtonModule {}
