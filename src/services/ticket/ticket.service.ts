import {Injectable} from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { Ticket } from "../../models/Ticket";
import { sleep } from "../../utilities/utils";
import config from '../../config';
@Injectable()
export class TicketService {
  constructor(private readonly http: HttpClient) {}

  async getTicket(tab_id: string, omnivoreLocationId: string) {
    try {
      const params = {
        ticket_number: tab_id,
        location: String(omnivoreLocationId),
      }
      const ticket = await this.http.get(`${config.serverUrl}/ticket`, { params }).toPromise();
    
      return {   
        ticket: ticket,
        error: null,
      }
    } catch (error) {
      return {   
        ticket: null,
        error: error
      }
    }    
  }
}
