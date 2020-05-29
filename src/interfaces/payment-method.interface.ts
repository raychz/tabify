import { User } from './user.interface';
import { TicketPayment } from './ticket-payment.interface';
import { TabifyBaseInterface } from './base.interface';

export interface PaymentMethod extends TabifyBaseInterface {
  user: User;
  token: string;
  fingerprint: string;
  last_four_digits: string;
  card_type: string;
  first_name: string;
  last_name: string;
  full_name: string;
  zip: string;
  month: number;
  year: number;
  ticketPayment: TicketPayment[];
}
