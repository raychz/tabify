import { TicketItemUser } from "./ticket-item-user.interface";
import { FraudPreventionCode } from "./fraud-prevention-code.interface";
import { PaymentMethod } from "./payment-method.interface";
import { Comment } from "./comment.interface";
import { Like } from "./like.interface";
import { TicketPayment } from "./ticket-payment.interface";
import { UserDetail } from "./user-detail.interface";
import { TicketUser } from "./ticket-user.interface";

export interface User {
  uid: string;
  ticketItems: TicketItemUser[];
  fraudPreventionCodes: FraudPreventionCode[];
  paymentMethods: PaymentMethod[];
  comments: Comment[];
  likes: Like[];
  ticketPayments: TicketPayment[];
  userDetail: UserDetail;
  tickets: TicketUser[];
}
