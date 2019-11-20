import { User } from "./user.interface";
import { Server } from "./server.interface";

export interface UserDetail {
  id: number;
  displayName: string;
  email: string;
  photo_url: string;
  user: User;
  server: Server;
}