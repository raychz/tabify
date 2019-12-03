import { NgModule, ModuleWithProviders } from '@angular/core';
import { TicketService } from '../../services/ticket/ticket.service';
import { AblyService } from '../../services/ticket/ably.service';
import { AblyTicketService } from '../../services/ticket/ably-ticket.service';
import { AblyTicketUsersService } from '../../services/ticket/ably-ticket-users.service';

@NgModule({ })
export class SharedPayModule {
  static forRoot(): ModuleWithProviders {
    return {
        ngModule: SharedPayModule,
        providers: [AblyService, AblyTicketService, AblyTicketUsersService, TicketService]
    };
}
}
