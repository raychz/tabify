import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@tabify/env';
import { AblyService } from '../../services/ticket/ably.service';
import { TicketUpdates } from '../../enums/';
import { Ticket } from '../../interfaces/ticket.interface';
import { TicketUser } from '../../interfaces/ticket-user.interface';
import { TicketItemUser } from '../../interfaces/ticket-item-user.interface';
import { getSelectItemsTicketUsersDescription, isItemOnMyTab, getPayersDescription, findUserShareOfItem } from '../../utilities/ticket.utilities';
import { TicketItem } from '../../interfaces/ticket-item.interface';
import { AuthService } from '../../services/auth/auth.service';
import { keyBy, resolveByString } from '../../utilities/general.utilities';
// import { AblyTicketUsersService } from '../../services/ticket/ably-ticket-users.service';

@Injectable()
export class AblyTicketService {
  ticket: Ticket;

  constructor(
    public ablyService: AblyService,
    // public ablyTicketUsersService: AblyTicketUsersService,
    private readonly http: HttpClient,
    private auth: AuthService,
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
        case TicketUpdates.TICKET_USERS_UPDATED:
          this.onTicketUsersUpdated(message.data);
          console.log("TICKET_ITEM_USERS_UPDATED", message);
          break;
        case TicketUpdates.TICKET_ITEM_USERS_REPLACED:
          this.onTicketItemUsersReplaced(message.data);
          console.log("TICKET_ITEM_USERS_REPLACED", message);
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

  private onTicketUserAdded(addedTicketUser: TicketUser) {
    if (!this.ticket) {
      console.error('The ticket is falsy, but an Ably message was received.')
      return;
    }

    const ticketUserIndex = this.ticket.users.findIndex(_ticketUser => _ticketUser.id === addedTicketUser.id);
    if (ticketUserIndex > -1) {
      console.log("This ticket user already exists in the ticket. Replacing...");
      this.ticket.users[ticketUserIndex] = addedTicketUser;
    } else {
      console.log("A new ticket user was added.");
      this.ticket.users.push(addedTicketUser);
    }

    this.synchronizeFrontendTicket();
    console.log("Updated ticket", this.ticket);
  }

  private onTicketUserRemoved(removedTicketUser: TicketUser) {
    if (!this.ticket) {
      console.error('The ticket is falsy, but an Ably message was received.')
      return;
    }

    const ticketUserIndex = this.ticket.users.findIndex(_ticketUser => _ticketUser.id === removedTicketUser.id);
    if (ticketUserIndex > -1) {
      console.log("A ticket user was removed.");
      this.ticket.users.splice(ticketUserIndex, 1);
    } else {
      console.log("The removed ticket user does not exist in the ticket. Skipping...");
    }

    this.synchronizeFrontendTicket();
    console.log('Updated ticket', this.ticket);
  }

  private onTicketUsersUpdated(updatedTicketUsers: TicketUser[]) {
    // Merge the properties of each user in this.ticket.users that is also in updatedTicketUsers
    updatedTicketUsers.forEach(updatedTicketUser => {
      const ticketUserIndex = this.ticket.users.findIndex(_ticketUser => _ticketUser.id === updatedTicketUser.id);
      if (ticketUserIndex > -1) {
        this.ticket.users[ticketUserIndex] = {
          ...this.ticket.users[ticketUserIndex],
          ...updatedTicketUser
        };
      } else {
        console.error('The updated ticket user could not be found.')
      }
    });
    this.synchronizeFrontendTicket();
  }

  private onTicketItemUsersReplaced({ newTicketItemUsers, itemId }: { newTicketItemUsers: TicketItemUser[], itemId: TicketItem["id"] }) {
    const ticketItem = this.ticket.items.find(_item => _item.id === itemId);
    ticketItem.users = newTicketItemUsers;
    this.synchronizeFrontendTicketItems([ticketItem]);
  }

  /** 
   * Updates the properties in the FrontendTicket interface, including:
   * - ticketUsersDescription
   * - usersMap
   */
  synchronizeFrontendTicket() {
    this.ticket.ticketUsersDescription = getSelectItemsTicketUsersDescription(this.ticket.users);
    this.ticket.usersMap = keyBy(this.ticket.users, 'user.uid');
    console.log("THE USER MAP", this.ticket.usersMap);
  }

  /** 
   * Updates the properties in the FrontendTicketItem interface, including:
   * - isItemOnMyTab
   * - payersDescription
   * - loading
   * - userShareOfItem
   */
  synchronizeFrontendTicketItems(items: TicketItem[] = this.ticket.items) {
    items.forEach(item => {
      item.usersMap = keyBy(item.users, 'user.uid');
      item.payersDescription = getPayersDescription(item.users);
      item.loading = false;
      console.log("ITEM USERS MAP", item.usersMap);
    });
  }
}