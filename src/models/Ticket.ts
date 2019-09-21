import { ITicket } from '../interfaces/ticket.interface';
import { ILocation } from '../interfaces/location.interface';
import { ITicketItem } from '../interfaces/ticket-item.interface';

export class Ticket implements ITicket {
  id: number;
  location: string | ILocation;
  tab_id: number;
  ticket_number: number;
  items: ITicketItem[];
  date_created: string;
  date_modified: string;

  constructor(params: ITicket) {
    this.id = params.id;
    this.location = params.location;
    this.tab_id = params.tab_id;
    this.ticket_number = params.ticket_number;
    this.items = params.items;
    this.date_created = params.date_created;
    this.date_modified = params.date_modified;
  }
}
