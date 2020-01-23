import { Ticket } from "./ticket.interface";
import { User } from "./user.interface";
import { PaymentMethod } from "./payment-method.interface";
import { TicketUserStatus } from "../enums";

export interface TicketUser extends FrontendTicketUser {
  id: number;
  ticket: Ticket;
  user: User;
  /** The total cost in cents of items on the ticket selected by this user */
  items: number;
  /** The sum total value in cents of all discounts for this user */
  discounts: number;
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
  isStatusPageExpanded: boolean;
  /** Selected payment method */
  paymentMethod: PaymentMethod;
  /** Selected tip percentage */
  tipPercentage: number;
}
