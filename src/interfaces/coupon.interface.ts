import { Location } from "./location.interface";

export enum CouponOffOf {ticket, item};
export enum CouponType {percent, dollar_value};

export interface ICoupon {
  id: number;
  description: string;
  value: number;
  estimated_dollar_value: number;
  date_created: Date;
  date_updated: Date;
  coupon_start_date: Date;
  coupon_end_date: Date;
  location: Location;
  usage_limit: number;
  usage_count: number;
  coupon_off_of: CouponOffOf;
  coupon_type: CouponType;
  menu_item_id?: number;
}
