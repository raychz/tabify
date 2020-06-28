import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FindPeoplePageRoutingModule } from './find-people-routing.module';

import { FindPeoplePage } from './find-people.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FindPeoplePageRoutingModule
  ],
  declarations: [FindPeoplePage]
})
export class FindPeoplePageModule {}
