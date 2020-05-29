import { UserDetail } from './user-detail.interface';
import { Ticket } from './ticket.interface';
import { TabifyBaseInterface } from './base.interface';
import { ServerReward } from './server-reward.interface';

export interface Server extends TabifyBaseInterface {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  employeeId: string;
  referralCode: string;
  location: Location;
  users: UserDetail[];
  ticket: Ticket[];
  serverRewards: ServerReward[];
}
