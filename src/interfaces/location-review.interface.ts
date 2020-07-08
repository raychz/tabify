import { TabifyBaseInterface } from './base.interface';
import { TicketUser } from './ticket-user.interface';
import { User } from './user.interface';

export interface LocationReview extends TabifyBaseInterface {
  location_rating?: number;
  average_item_rating?: number;
  feedback?: string;
  ticket_user?: TicketUser;
  location: Location;
  user: User;
}
