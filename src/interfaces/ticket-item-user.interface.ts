import { TicketItem } from './ticket-item.interface';
import { User } from './user.interface';
import { TabifyBaseInterface } from './base.interface';

export interface TicketItemUser extends TabifyBaseInterface {
  ticketItem: TicketItem;
  user: User;
  price: number;
}
