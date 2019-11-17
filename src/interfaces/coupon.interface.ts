import { ILocation } from "./location.interface";

export interface ICoupon {
  id: number,
  header: string,
  description: string,
  date_created: Date;
  date_updated: Date;
  coupon_start_date: Date;
  coupon_end_date: Date;
  location: ILocation;
}
