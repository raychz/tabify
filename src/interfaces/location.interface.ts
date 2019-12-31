import { Ticket } from "./ticket.interface";
import { Server } from "./server.interface";

export interface Location {
  id?: number;
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
  open_discount_id: string;
}
