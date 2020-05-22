import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PayPage } from './pay.page';
import { TabLookupComponent } from './tab-lookup/tab-lookup.component';
import { CouponComponent } from './coupon/coupon.component';
import { PayPageRoutingModule } from './pay-routing.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PayPageRoutingModule
  ],
  declarations: [PayPage, TabLookupComponent, CouponComponent]
})
export class PayPageModule {}
