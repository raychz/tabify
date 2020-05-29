import { TabifyBaseInterface } from './base.interface';
import { Coupon } from './coupon.interface';
import { User } from './user.interface';

export interface UserToCoupons extends TabifyBaseInterface {
    usage_count: number;
    coupon: Coupon;
    user: User;
}
