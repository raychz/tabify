import { Ticket } from './ticket.interface';
import { Server } from './server.interface';
import { TabifyBaseInterface } from './base.interface';
import { LocationReview } from './location-review.interface';
import { Coupon } from './coupon.interface';

export interface Location extends TabifyBaseInterface {
  omnivore_id?: string;
  name: string;
  city: string;
  country: string;
  state: string;
  street1: string;
  street2: string;
  latitude: string;
  longitude: string;
  phone: string;
  timezone: string;
  website: string;
  photo_url?: string;
  zip: string;
  google_place_id?: string;
  tax_rate?: number;
  tickets: Ticket[];
  servers: Server[];
  coupons: Coupon[];
  open_discount_id?: string;
  coupons_only?: boolean;
  reviews: LocationReview;
}
