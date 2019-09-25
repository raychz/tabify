import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from '@tabify/env';

@Injectable()
export class TicketItemService {
    
    constructor(private readonly httpClient: HttpClient) { }

    // get stories that a user was part of (personal feed)
    async getTicketItems(ticketId: number): Promise<any> {
        return await this.httpClient.get(`${environment.serverUrl}/ticket-item/${ticketId}`).toPromise();
    }
}