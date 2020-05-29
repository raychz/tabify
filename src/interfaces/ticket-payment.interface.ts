import { TicketPaymentStatus } from '../enums';
import { Ticket } from './ticket.interface';
import { User } from './user.interface';
import { PaymentMethod } from './payment-method.interface';
import { TabifyBaseInterface } from './base.interface';
import { Coupon } from './coupon.interface';

export interface TicketPayment extends TabifyBaseInterface {
    amount?: number;
    tip?: number;
    /** Spreedly transaction message */
    message?: string;
    /** Omnivore's payment id */
    omnivore_id?: string;
    /** Omnivore's response to Spreedly's payment method delivery */
    omnivore_response?: string;
    /** Spreedly transaction token */
    transaction_token?: string;
    ticket_payment_status?: TicketPaymentStatus;
    ticket?: Ticket;
    user?: User;
    coupon?: Coupon;
    paymentMethod: PaymentMethod;
}
