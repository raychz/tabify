import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@tabify/env';
import { AblyService } from '../../services/ticket/ably.service';
import { TicketUpdates, TicketUserStatus, TicketStatus, TicketMode } from '../../enums/';
import { Ticket } from '../../interfaces/ticket.interface';
import { TicketUser } from '../../interfaces/ticket-user.interface';
import { TicketItemUser } from '../../interfaces/ticket-item-user.interface';
import { getSelectItemsTicketUsersDescription, isItemOnMyTab, getPayersDescription, findUserShareOfItem, getTicketItemName } from '../../utilities/ticket.utilities';
import { TicketItem } from '../../interfaces/ticket-item.interface';
import { AuthService } from '../../services/auth/auth.service';
import { keyBy, resolveByString, abbreviateName } from '../../utilities/general.utilities';
import { TicketTotal } from '../../interfaces/ticket-total.interface';
import { FraudPreventionCode } from '../../interfaces/fraud-prevention-code.interface';
// import { AblyTicketUsersService } from '../../services/ticket/ably-ticket-users.service';

@Injectable({ providedIn: 'root' })
export class AblyTicketService {
  ticket: Ticket;
  fraudPreventionCode: FraudPreventionCode;

  constructor(
    public ablyService: AblyService,
    // public ablyTicketUsersService: AblyTicketUsersService,
    private readonly http: HttpClient,
    private auth: AuthService,
  ) { }

  async clearState() {
    if (this.ticket) {
      await this.unsubscribeFromAllTicketUpdates(this.ticket.id);
      this.ticket = null;
    } else {
      console.error('An attempt was made to clear the ticket service state, but the state is already empty.');
    }
  }

  public async addUserToDatabaseTicket() {
    if (!this.ticket) {
      console.log('can not add user to ticket - ably ticket is undefined');
      return;
    }
    return await this.http
      .post<TicketUser>(`${environment.serverUrl}/tickets/${this.ticket.id}/users`, {})
      .toPromise();
  }

  public async addUserToTicketItem(ticketId: number, ticketUserId: number, itemId: number) {
    return await this.http
      .post(`${environment.serverUrl}/tickets/${ticketId}/items/${itemId}/users/${ticketUserId}`, {})
      .toPromise();
  }

  public async removeUserFromTicketItem(ticketId: number, ticketUserId: number, itemId: number) {
    return await this.http
      .delete(`${environment.serverUrl}/tickets/${ticketId}/items/${itemId}/users/${ticketUserId}`)
      .toPromise();
  }

  async subscribeToTicketUpdates(ticketId) {
    const ticketChannel = this.ablyService.getChannel(ticketId);
    ticketChannel.on('attached', (stateChange) => {
      console.log('channel ' + ticketChannel.name + ' is now attached');
      console.log('Message continuity on this channel ' +
        (stateChange.resumed ? 'was' : 'was not') + ' preserved');
    });
    await ticketChannel.subscribe((message) => {
      const messages = [];
      if (message.name === TicketUpdates.MULTIPLE_UPDATES) {
        messages.push(...message.data);
      } else {
        messages.push(message);
      }
      for (const _message of messages) {
        switch (_message.name) {
          case TicketUpdates.TICKET_UPDATED:
            this.onTicketUpdate(_message.data);
            console.log('TICKET_UPDATED', _message);
            break;
          case TicketUpdates.TICKET_USER_ADDED:
            this.onTicketUserAdded(_message.data);
            console.log('TICKET_USER_ADDED', _message);
            break;
          case TicketUpdates.TICKET_USER_REMOVED:
            this.onTicketUserRemoved(_message.data);
            console.log('TICKET_USER_REMOVED', _message);
            break;
          case TicketUpdates.TICKET_USERS_UPDATED:
            this.onTicketUsersUpdated(_message.data);
            console.log('TICKET_USERS_UPDATED', _message);
            break;
          case TicketUpdates.TICKET_ITEM_USERS_REPLACED:
            this.onTicketItemUsersReplaced(_message.data);
            console.log('TICKET_ITEM_USERS_REPLACED', _message);
            break;
          case TicketUpdates.TICKET_TOTALS_UPDATED:
            this.onTicketTotalsUpdated(_message.data);
            console.log('TICKET_TOTALS_UPDATED', _message);
            break;
          case TicketUpdates.TICKET_PAYMENTS_UPDATED:
            console.log('TICKET_PAYMENTS_UPDATED', _message);
            break;
          default:
            throw new Error('Message name does not correspond to a handler');
        }
      }
    });
  }

  async unsubscribeFromAllTicketUpdates(ticketId) {
    const ticketChannel = this.ablyService.getChannel(ticketId);
    ticketChannel.unsubscribe();
    ticketChannel.off();
    await this.ablyService.detachChannel(ticketChannel);
  }

  async getTicket(id: number) {
    const ticket = await this.http
      .get(`${environment.serverUrl}/tickets/${id}`)
      .toPromise();
    this.ticket = ticket as any;
    console.log('ABLY TICKET', this.ticket);
    return ticket;
  }

  /**
   * Sends a request to retrieve a ticket object from tabify-server's database (not Firestore).
   * @param ticketNumber
   * @param locationId
   * @param ticketStatus
   */
  public async searchTicket(ticketNumber: number, locationId: number, ticketStatus: string, openedRecently: boolean) {
    const params = {
      opened_recently: String(openedRecently),
      ticket_number: String(ticketNumber),
      location: String(locationId), // Corresponds to location id in Tabify's db
      ticket_status: ticketStatus
    };
    this.ticket = await this.http
      .get(`${environment.serverUrl}/tickets/`, { params })
      .toPromise() as Ticket;
    return this.ticket;
  }

  /**
   * Sends a request to create a ticket object in tabify-server's database (not Firestore).
   * @param ticketNumber
   * @param locationId
   */
  public async createTicket(ticketNumber: number, locationId: number, openedRecently: boolean) {
    const body = {
      ticket_number: String(ticketNumber),
      location: String(locationId), // Corresponds to location id in Tabify's db
      opened_recently: String(openedRecently),
    };

    this.ticket = await this.http
      .post(`${environment.serverUrl}/tickets`, body)
      .toPromise() as Ticket;
    return this.ticket;
  }

  public async updateTicketConfig(body: {mode: TicketMode, partySize: number}) {
    if (!this.ticket) {
      console.log('cannot update ticket config - no ticket selected');
      return undefined;
    }
    const updatedTicket = await this.http
      .patch(`${environment.serverUrl}/tickets/${this.ticket.id}`, body)
      .toPromise() as Ticket;
    this.onTicketUpdate(updatedTicket);
    return this.ticket;
  }

  async setTicketUserStatus(ticketId: number, ticketUserId: number, status: TicketUserStatus) {
    const res = await this.http
      .patch(`${environment.serverUrl}/tickets/${ticketId}/users`, { status, ticketUserId })
      .toPromise() as TicketUser;
    const currentUser = this.ticket.usersMap.get(this.auth.getUid());
    currentUser.status = res.status;
  }

  onTicketUpdate(updatedTicket: Ticket) {
    console.log(this.ticket);
    this.ticket = {
      ...this.ticket, ...updatedTicket
    };
    console.log('ticket updated', this.ticket);
  }

  onTicketUserAdded(addedTicketUser: TicketUser) {
    if (!this.ticket) {
      console.error('The ticket is falsy, but an Ably message was received.');
      return;
    }

    const ticketUserIndex = this.ticket.users.findIndex(_ticketUser => _ticketUser.id === addedTicketUser.id);
    if (ticketUserIndex > -1) {
      console.log('This ticket user already exists in the ticket. Replacing...');
      this.ticket.users[ticketUserIndex] = addedTicketUser;
    } else {
      console.log('A new ticket user was added.');
      this.ticket.users.push(addedTicketUser);
    }

    this.synchronizeFrontendTicket();
    console.log('Updated ticket', this.ticket);
  }

  private onTicketUserRemoved(removedTicketUser: TicketUser) {
    if (!this.ticket) {
      console.error('The ticket is falsy, but an Ably message was received.');
      return;
    }

    const ticketUserIndex = this.ticket.users.findIndex(_ticketUser => _ticketUser.id === removedTicketUser.id);
    if (ticketUserIndex > -1) {
      console.log('A ticket user was removed.');
      this.ticket.users.splice(ticketUserIndex, 1);
    } else {
      console.log('The removed ticket user does not exist in the ticket. Skipping...');
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
        console.error('The updated ticket user could not be found.');
      }
    });
    this.synchronizeFrontendTicket();
  }

  private onTicketItemUsersReplaced({ newTicketItemUsers, itemId }: { newTicketItemUsers: TicketItemUser[], itemId: TicketItem['id'] }) {
    const ticketItem = this.ticket.items.find(_item => _item.id === itemId);
    ticketItem.users = newTicketItemUsers;
    this.synchronizeFrontendTicketItems([ticketItem]);
  }

  private onTicketTotalsUpdated(ticketTotal: TicketTotal) {
    this.ticket.ticketTotal = ticketTotal;
  }

  /**
   * Updates the properties in the FrontendTicket interface, including:
   * - ticketUsersDescription
   * - usersMap
   */
  synchronizeFrontendTicket() {
    this.ticket.ticketUsersDescription = getSelectItemsTicketUsersDescription(this.ticket.users);
    // TODO: Consider moving this to the backend
    this.ticket.users.forEach(u => u.user.userDetail.abbreviatedName = abbreviateName(u.user.userDetail.displayName));
    this.ticket.usersMap = keyBy(this.ticket.users, 'user.uid');
    console.log('THE USER MAP', this.ticket.usersMap);
  }

  /**
   * Updates the properties in the FrontendTicketItem interface for the given items, including:
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
    });
  }
}
