import { Location } from './location.interface';
import { CouponOffOf, CouponType } from '../enums/index';
import { TabifyBaseInterface } from './base.interface';
import { UserToCoupons } from './user-to-coupons.interface';

export interface CouponResponse {
  validCoupons: Coupon[];
  usedCoupons: Coupon[];
  upcomingCoupons: Coupon[];
}

export interface Coupon extends TabifyBaseInterface {
  description: string;
  value: number;
  estimated_dollar_value: number;
  coupon_start_date: Date;
  coupon_end_date: Date;
  location: Location;
  usage_limit: number;
  coupon_off_of: CouponOffOf;
  coupon_type: CouponType;
  userToCoupons: UserToCoupons[];
  menu_item_id?: number;
  applies_to_everyone: boolean;
  image_url: string;
  coupon_restrictions?: any;
  ticketInformation?: {
    menu_item_name?: string;
    dollar_value: number;
    estimated_tax_difference: number;
  };
}
