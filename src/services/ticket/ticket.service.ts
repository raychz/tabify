import {Injectable} from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { Ticket } from "../../models/Ticket";
import { sleep } from "../../utilities/utils";
import config from '../../config';
@Injectable()
export class TicketService {

  // ticket: Ticket;
  constructor(private readonly http: HttpClient) {}

  async addSelf(toTicket: string, location: string) {
    const ticket = await this.http.post(`${config.serverUrl}/ticket`, {
      ticket: toTicket,
      location
    }).toPromise();

    console.log(ticket);
    // Check if error, if error return error, if no error set instance ticket;
    return {   
      ticket: null,
      error: null
    }
  }
}
