import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from '@tabify/env';

@Injectable()
export class TicketItemService {

    constructor(private readonly httpClient: HttpClient) { }

    async getTicketItems(ticketId: number): Promise<any> {
        return await this.httpClient.get(`${environment.serverUrl}/ticket-item/${ticketId}`).toPromise();
    }
}