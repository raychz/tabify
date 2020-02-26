import { NgModule, ModuleWithProviders } from '@angular/core';
import { TicketService } from '../../services/ticket/ticket.service';
import { AblyService } from '../../services/ticket/ably.service';
import { AblyTicketService } from '../../services/ticket/ably-ticket.service';
import { AblyTicketUsersService } from '../../services/ticket/ably-ticket-users.service';
import { FraudPreventionModule } from './fraud-prevention/fraud-prevention.module'

@NgModule({ })
export class SharedPayModule {
  imports: [FraudPreventionModule]
  static forRoot(): ModuleWithProviders {
    return {
        ngModule: SharedPayModule,
        providers: [AblyService, AblyTicketService, AblyTicketUsersService, TicketService]
    };
}
}
