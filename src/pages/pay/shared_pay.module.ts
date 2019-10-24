import { NgModule, ModuleWithProviders } from '@angular/core';
import { TicketService } from '../../services/ticket/ticket.service';

@NgModule({ })
export class SharedPayModule {
  static forRoot(): ModuleWithProviders {
    return {
        ngModule: SharedPayModule,
        providers: [TicketService]
    };
}
}
