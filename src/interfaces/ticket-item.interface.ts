import { User } from 'firebase';

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
}
