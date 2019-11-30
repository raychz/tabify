import { Ticket } from "./ticket.interface";
import { TicketItemUser } from "./ticket-item-user.interface";

/**
 * The properties in this interface are representative of a backend TicketItem
 */
export interface TicketItem extends FrontendTicketItem {
  id?: number;
  ticket_item_id?: number;
  ticket?: Ticket;
  name?: string;
  price?: number;
  quantity?: number;
  users?: TicketItemUser[];
}

/**
 * The properties in this interface are specific to the frontend
 */
interface FrontendTicketItem {
  usersMap: Map<string, TicketItemUser>;
  payersDescription?: string;
  loading?: boolean;
}