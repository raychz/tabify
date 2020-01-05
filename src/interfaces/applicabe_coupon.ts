import { Location } from "./location.interface";
import { TicketItem } from "./ticket-item.interface";
import { ICoupon } from "./coupon.interface";
import { TicketUser } from "./ticket-user.interface";
import { TicketPayment } from "./ticket-payment.interface";

export interface IApplicableCoupon {
  id: number;
  dollar_value: number;
  estimated_tax_difference: number;
  coupon: ICoupon;
  ticketUser: TicketUser;
  slectedTicketUser?: TicketUser;
  ticketPayment?: TicketPayment
}
