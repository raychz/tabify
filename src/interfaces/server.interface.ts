import { UserDetail } from "./user-detail.interface";

export interface Server {
  id: number;
  displayName: string;
  email: string;
  password: string;
  referralCode: string;
  location: Location;
  users: UserDetail[];
}