import { Ticket } from './ticket.interface';
import { TicketItemUser } from './ticket-item-user.interface';
import { TabifyBaseInterface } from './base.interface';
import { TicketItemReview } from './ticket-item-review';

/**
 * The properties in this interface are specific to the frontend
 */
interface FrontendTicketItem {
  usersMap: Map<string, TicketItemUser>;
  payersDescription?: string;
  loading?: boolean;

  // TODO: Replace the following with actual review/feedback containers
  rating: number;
  feedback: string;
}

/**
 * The properties in this interface are representative of a backend TicketItem
 */
export interface TicketItem extends FrontendTicketItem, TabifyBaseInterface {
  ticket_item_id?: number;
  menu_item_id?: string;
  ticket?: Ticket;
  name?: string;
  price?: number;
  quantity?: number;
  users?: TicketItemUser[];
  reviews: TicketItemReview[];
}
