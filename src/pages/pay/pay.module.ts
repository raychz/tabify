import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PayPage } from './pay';
import { TicketService } from '../../services/ticket/ticket.service';
import { FirestoreService } from '../../services/firestore/firestore.service';
@NgModule({
  declarations: [
    PayPage,
  ],
  imports: [
    IonicPageModule.forChild(PayPage),
  ],
  providers: [
    TicketService,
    FirestoreService
  ]
})
export class PayPageModule {}
