export interface ILocation {
  id: number;
  omnivore_id: string;
  name: string;
  city: string;
  country: string;
  state: string;
  street1: string;
  street2: string;
  longitude: string;
  latitude: string;
  phone: string;
  timezone: string;
  website: string;
  photo_url: string;
  zip: string;
  google_place_id?: string;
  [key: string]: any;
}
