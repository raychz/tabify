import { Location } from './location.interface';
import { FraudPreventionCode } from './fraud-prevention-code.interface';
import { TicketStatus } from '../enums';
import { TicketItem } from './ticket-item.interface';
import { Story } from './story.interface';
import { TicketUser } from './ticket-user.interface';
import { TicketTotal } from './ticket-total.interface';
import { TicketPayment } from './ticket-payment.interface';
import { Server } from './server.interface';
import { TabifyBaseInterface } from './base.interface';
import { ServerReward } from './server-reward.interface';

interface FrontendTicket {
  ticketUsersDescription?: string;
  usersMap: Map<string, TicketUser>;
}

// Keep up to date with tabify-server/src/entity/ticket.entity.ts
export interface Ticket extends FrontendTicket, TabifyBaseInterface {
  ticket_number?: number;
  tab_id?: string;
  location?: Location;
  items?: TicketItem[];
  fraudPreventionCodes?: FraudPreventionCode[];
  story?: Story;
  users?: TicketUser[];
  ticket_status?: TicketStatus;
  ticketTotal?: TicketTotal;
  ticketPayments?: TicketPayment[];
  server?: Server;
  table_name?: string;
  serverReward?: ServerReward;
}
