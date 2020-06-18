import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ExplorePage } from './explore.page';
import { TabifyHeaderModule } from '../tabify-header/tabify-header.module';
import { LocationModule } from '../locations/component/location.component.module';

@NgModule({
  imports: [
    IonicModule,
    TabifyHeaderModule,
    CommonModule,
    FormsModule,
    LocationModule,
    RouterModule.forChild([{ path: '', component: ExplorePage }])
  ],
  declarations: [ExplorePage]
})
export class ExploreModule {}
