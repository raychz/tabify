import { TicketItemUser } from './ticket-item-user.interface';

export interface ItemIdToTicketItemUsersArray {
    [itemId: number]: TicketItemUser[];
}