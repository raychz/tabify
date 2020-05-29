import { Ticket } from './ticket.interface';
import { TabifyBaseInterface } from './base.interface';

export interface TicketTotal extends TabifyBaseInterface {
    /** The sum total value in cents of all ticket-level discounts */
    discounts: number;
    /** The unpaid total in cents of the ticket (total - paid) */
    due: number;
    /** The sum total cost in cents of all items on the ticket */
    items: number;
    /** The sum total cost in cents of all other charges on the ticket. Other charges are taxed */
    other_charges: number;
    /** The total amount in cents paid */
    paid: number;
    /** The sum total cost in cents of all service charges on the ticket. Service charges are not taxed */
    service_charges: number;
    /** The subtotal in cents before tax (items + other_charges - discounts) */
    sub_total: number;
    /** The total tax in cents on the ticket */
    tax: number;
    /** The total value in cents of applied tips */
    tips: number;
    /** The final amount in cents to be paid (subtotal + service_charges + tax), not including tip */
    total: number;
    // Bi-directional one-to-one
    ticket?: Ticket;
}
