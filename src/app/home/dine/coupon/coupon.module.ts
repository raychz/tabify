import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CouponComponent } from './coupon.component';
import { LocationModule } from '../locations/component/location.component.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    LocationModule
  ],
  declarations: [CouponComponent],
  exports: [CouponComponent],
})
export class CouponModule {}
