import { FirestoreTicketItem } from "../services/ticket/ticket.service";

export interface IUser {
    uid: any,
    name: any,
    items: FirestoreTicketItem[];
    subtotal: number,
    picture: string,
    status: string,
}
