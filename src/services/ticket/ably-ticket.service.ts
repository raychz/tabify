import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@tabify/env';
import { AblyService } from '../../services/ticket/ably.service';
import { TicketUpdates } from '../../enums/';
// import { AblyTicketUsersService } from '../../services/ticket/ably-ticket-users.service';

@Injectable()
export class AblyTicketService {
  ticket: any;

  constructor(
    public ablyService: AblyService,
    // public ablyTicketUsersService: AblyTicketUsersService,
    private readonly http: HttpClient,
  ) { }

  onTicketUpdate(data) {
    console.log("Calling from service", data);
  }

  async subscribeToTicketUpdates(ticketId) {
    const ticketChannel = this.ablyService.getChannel(ticketId);
    ticketChannel.on('attached', (stateChange) => {
      console.log('channel ' + ticketChannel.name + ' is now attached');
      console.log('Message continuity on this channel ' +
        (stateChange.resumed ? 'was' : 'was not') + ' preserved');
    });
    await ticketChannel.subscribe((message) => {
      console.log("RECEIVED A MESSAGE", message);
      switch (message.name) {
        case TicketUpdates.TICKET_USER_ADDED:
          this.onTicketUserAdded(message.data);
          console.log("TICKET_USER_ADDED", message);
          break;
        case TicketUpdates.TICKET_USER_REMOVED:
          this.onTicketUserRemoved(message.data);
          console.log("TICKET_USER_REMOVED", message);
          break;
        case TicketUpdates.TICKET_ITEM_USERS_UPDATED:
          console.log("TICKET_ITEM_USERS_UPDATED", message);
          break;
        case TicketUpdates.TICKET_PAYMENTS_UPDATED:
          console.log("TICKET_PAYMENTS_UPDATED", message);
          break;
        default:
          throw "Message name does not correspond to a handler";
      }
    });
  }

  async unsubscribe() {

  }

  async getTicket(id: number) {
    const ticket = await this.http
      .get(`${environment.serverUrl}/tickets/${id}`)
      .toPromise();
    this.ticket = ticket as any;
    console.log("ABLY TICKET", this.ticket);
    return ticket;
  }

  private onTicketUserAdded(message: any) {
    if (!this.ticket) {
      console.error('The ticket is falsy, but an Ably message was received.')
      return;
    }

    const ticketUserIndex = this.ticket.users.findIndex(ticketUser => ticketUser.id === message.id);
    if (ticketUserIndex > -1) {
      console.log("This ticket user already exists in the ticket. Replacing...");
      this.ticket.users[ticketUserIndex] = message;
    } else {
      console.log("A new ticket user was added.");
      this.ticket.users.push(message);
    }

    console.log('Updated ticket', this.ticket);
  }

  private onTicketUserRemoved(message: any) {
    if (!this.ticket) {
      console.error('The ticket is falsy, but an Ably message was received.')
      return;
    }

    const ticketUserIndex = this.ticket.users.findIndex(ticketUser => ticketUser.id === message.id);
    if (ticketUserIndex > -1) {
      console.log("A ticket user was removed.");
      this.ticket.users.splice(ticketUserIndex, 1);
    } else {
      console.log("The removed ticket user does not exist in the ticket. Skipping...");
    }

    console.log('Updated ticket', this.ticket);
  }
}