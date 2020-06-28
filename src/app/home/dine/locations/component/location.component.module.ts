import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LocationComponent } from './location.component';

@NgModule({
  imports: [
    IonicModule,
    CommonModule
  ],
  declarations: [LocationComponent],
  exports: [LocationComponent],
})
export class LocationModule {}
