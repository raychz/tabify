import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CouponComponent } from './coupon.component';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
  ],
  declarations: [CouponComponent],
  exports: [CouponComponent],
})
export class CouponModule {}
