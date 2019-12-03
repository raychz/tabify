import { Story } from "./story.interface";
import { User } from "./user.interface";

export interface Like {
  id: number;
  story: Story;
  user: User;
}