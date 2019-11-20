import { Location } from './location.interface';
import { FraudPreventionCode } from './fraud-prevention-code.interface';
import { TicketStatus } from '../enums';
import { TicketItem } from './ticket-item.interface';
import { Story } from './story.interface';
import { TicketUser } from './ticket-user.interface';
import { TicketTotal } from './ticket-total.interface';
import { TicketPayment } from './ticket-payment.interface';

// Keep up to date with tabify-server/src/entity/ticket.entity.ts
export interface Ticket extends FrontendTicket {
  id?: number;
  firestore_doc_id?: string;
  ticket_number?: number;
  location?: Location;
  items?: TicketItem[];
  date_created?: Date;
  date_modified?: Date;
  fraudPreventionCodes?: FraudPreventionCode[];
  story?: Story;
  users?: TicketUser[];
  ticket_status?: TicketStatus;
  ticketTotal?: TicketTotal;
  ticketPayments?: TicketPayment[];
}

interface FrontendTicket {
  ticketUsersDescription?: string;
}