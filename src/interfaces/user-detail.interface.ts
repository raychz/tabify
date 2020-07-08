import { User } from './user.interface';
import { Server } from './server.interface';
import { TabifyBaseInterface } from './base.interface';

export interface FrontendUserDetail {
  abbreviatedName: string;
}

export interface UserDetail extends FrontendUserDetail, TabifyBaseInterface {
  displayName: string;
  email: string;
  photo_url: string;
  user: User;
  server: Server;
  newUser: boolean;
}
