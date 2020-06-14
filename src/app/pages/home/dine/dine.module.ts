import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DinePage } from './dine.page';
import { TabLookupComponent } from './tab-lookup/tab-lookup.component';
import { CouponComponent } from './coupon/coupon.component';
import { LocationComponent } from './locations/location.component';
import { DinePageRoutingModule } from './dine-routing.module';
import { TabifyHeaderModule } from '../tabify-header/tabify-header.module';
import { FraudHeaderModule } from './fraud-header/fraud-header.module';
import { TabLookupModule } from './tab-lookup/tab-lookup.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    TabifyHeaderModule,
    FraudHeaderModule,
    TabLookupModule,
    FormsModule,
    ReactiveFormsModule,
    DinePageRoutingModule
  ],
  declarations: [DinePage, CouponComponent, LocationComponent],
  entryComponents: [LocationComponent]
})
export class DinePageModule {}
