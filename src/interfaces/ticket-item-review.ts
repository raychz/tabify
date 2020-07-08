import { TabifyBaseInterface } from './base.interface';
import { User } from './user.interface';
import { TicketItem } from './ticket-item.interface';

export interface TicketItemReview extends TabifyBaseInterface {
  rating: number;
  feedback?: string;
  ticket_item?: TicketItem;
  location: Location;
  user: User;
}
