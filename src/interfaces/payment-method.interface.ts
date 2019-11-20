import { User } from "./user.interface";

export interface PaymentMethod {
  id: number;
  user: User;
  token: string;
  fingerprint: string;
  last_four_digits: string;
  card_type: string;
  first_name: string;
  last_name: string;
  full_name: string;
  zip: string;
  month: number;
  year: number;
  date_created: Date;
  date_updated: Date;
}
