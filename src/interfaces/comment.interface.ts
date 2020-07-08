import { Story } from './story.interface';
import { User } from './user.interface';
import { TabifyBaseInterface } from './base.interface';

export interface Comment extends TabifyBaseInterface {
  text: string;
  story: Story;
  user: User;
}
