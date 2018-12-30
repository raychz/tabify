import {Injectable} from "@angular/core";
import { HttpClient } from '@angular/common/http';

@Injectable()
export class TicketService {
  constructor(private readonly http: HttpClient) {}

  getTicket() {}

  addTicketItem() {}

  removeTicketItem() {}

  removeAllMyItems() {}

}
