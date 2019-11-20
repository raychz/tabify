import { Ticket } from "./ticket.interface";
import { TicketItemUser } from "./ticket-item-user.interface";

export interface TicketItem {
  id?: number;
  ticket_item_id?: number;
  ticket?: Ticket;
  name?: string;
  price?: number;
  quantity?: number;
  users?: TicketItemUser[];
}
