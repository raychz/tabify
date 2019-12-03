import { TicketItem } from "./ticket-item.interface";
import { User } from "./user.interface";

export interface TicketItemUser {
  id?: number;
  ticketItem: TicketItem;
  user: User;
  price: number;
}
