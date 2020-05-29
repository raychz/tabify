import { TicketItemUser } from './ticket-item-user.interface';
import { FraudPreventionCode } from './fraud-prevention-code.interface';
import { PaymentMethod } from './payment-method.interface';
import { Comment } from './comment.interface';
import { Like } from './like.interface';
import { TicketPayment } from './ticket-payment.interface';
import { UserDetail } from './user-detail.interface';
import { TicketUser } from './ticket-user.interface';
import { LocationReview } from './location-review.interface';
import { TicketItemReview } from './ticket-item-review';
import { UserToCoupons } from './user-to-coupons.interface';

export interface User {
  uid: string;
  date_created?: Date;
  date_updated?: Date;
  ticketItems: TicketItemUser[];
  fraudPreventionCodes: FraudPreventionCode[];
  paymentMethods: PaymentMethod[];
  comments: Comment[];
  likes: Like[];
  ticketPayments: TicketPayment[];
  location_reviews: LocationReview[];
  item_revies: TicketItemReview[];
  userDetail: UserDetail;
  userToCoupons: UserToCoupons[];
  tickets: TicketUser[];
}
