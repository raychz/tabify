import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TicketDetailsPage } from './ticket-details';

@NgModule({
  declarations: [
    TicketDetailsPage,
  ],
  imports: [
    IonicPageModule.forChild(TicketDetailsPage),
  ],
})
export class TicketDetailsModule {}
