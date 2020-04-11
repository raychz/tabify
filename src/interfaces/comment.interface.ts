import { Story } from "./story.interface";
import { User } from "./user.interface";

export interface Comment {
  id: number;
  text: string;
  story: Story;
  user: User;
  date_created: Date;
}