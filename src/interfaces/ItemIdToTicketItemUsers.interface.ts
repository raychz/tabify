import { TicketItemUser } from './ticket-item-user.interface';

export interface ItemIdToTicketItemUsers {
    [itemId: number]: Set<TicketItemUser>;
}