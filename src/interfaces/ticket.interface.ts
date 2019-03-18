import { ITicketItem } from './ticket-item.interface';
import { ILocation } from './location.interface';

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
