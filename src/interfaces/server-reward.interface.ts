import { TabifyBaseInterface } from './base.interface';
import { Server } from './server.interface';
import { Ticket } from './ticket.interface';

export interface ServerReward extends TabifyBaseInterface {
    server: Server;
    ticket: Ticket;
    payment_amount: number;
}
