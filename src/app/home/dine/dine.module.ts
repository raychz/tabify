import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DinePage } from './dine.page';
import { CouponModule } from './coupon/coupon.module';
import { DinePageRoutingModule } from './dine-routing.module';
import { TabifyHeaderModule } from '../tabify-header/tabify-header.module';
import { FraudCodeModule } from './fraud-code/fraud-code.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    TabifyHeaderModule,
    FraudCodeModule,
    FormsModule,
    CouponModule,
    ReactiveFormsModule,
    DinePageRoutingModule
  ],
  providers: [DinePage],
  declarations: [DinePage],
})
export class DinePageModule {}
