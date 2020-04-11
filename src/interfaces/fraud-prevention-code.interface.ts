import { Ticket } from "./ticket.interface";
import { User } from "./user.interface";

export interface FraudPreventionCode {
  id: number;
  code: string;
  date_created: Date;
  date_updated: Date;
  ticket: Ticket;
  user: User;
}
