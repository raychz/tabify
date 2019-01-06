import { ILocation } from '../pages/pay/location/location';
import { User } from 'firebase';

export interface ITicket {
  /**
   * Unique id from Tabify server
   */
  id: number;
  location: string | ILocation;
  /**
   * Unique id provided by Omnivore
   */
  tab_id: number;
  /**
   * A ticket number a restaurant's receipt
   */
  ticket_number: number;
  items: ITicketItem[];
  date_created: string;
  date_modified: string;
}

export interface ITicketItem {
  /**
   * Unique id from Tabify server
   */
  id: number;
  /**
   * A ticket item number a restaurant's receipt
   */
  ticket_item_id: number;
  name: string;
  price: number;
  quantity: number;
  payers: User[];
}
