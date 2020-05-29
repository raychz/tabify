import { Ticket } from './ticket.interface';
import { User } from './user.interface';
import { TabifyBaseInterface } from './base.interface';

export interface FraudPreventionCode extends TabifyBaseInterface {
  code: string;
  ticket: Ticket;
  user: User;
}
