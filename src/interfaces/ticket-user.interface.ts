import { Ticket } from "./ticket.interface";
import { User } from "./user.interface";
import { PaymentMethod } from "./payment-method.interface";
import { TicketUserStatus } from "../enums";

export interface TicketUser extends FrontendTicketUser {
  id: number;
  ticket: Ticket;
  user: User;
  /** The subtotal in cents before tax (items + other_charges - discounts) */
  sub_total: number;
  /** The total tax in cents on the ticket */
  tax: number;
  /** The total value in cents of applied tips */
  tips: number;
  /** The final amount in cents to be paid (subtotal + service_charges + tax), not including tip */
  total: number;
  /** Selected items count */
  selectedItemsCount: number;
  /** Ticket user status */
  status?: TicketUserStatus;
}

interface FrontendTicketUser {
  /** Controls whether the waiting room card for this user is expanded */
  isWaitingRoomExpanded: boolean;
  /** Selected payment method */
  paymentMethod: PaymentMethod;
  /** Selected tip percentage */
  tipPercentage: number;
}
