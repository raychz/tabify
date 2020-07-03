import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ExplorePage } from './explore.page';
import { TabifyHeaderModule } from '../tabify-header/tabify-header.module';
import { LocationModule } from '../dine/locations/component/location.component.module';
import { ExplorePageRoutingModule } from './explore-routing.module';

@NgModule({
  imports: [
    IonicModule,
    TabifyHeaderModule,
    CommonModule,
    FormsModule,
    LocationModule,
    ExplorePageRoutingModule,
  ],
  declarations: [ExplorePage]
})
export class ExploreModule {}