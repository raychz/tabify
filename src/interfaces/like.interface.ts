import { Story } from './story.interface';
import { User } from './user.interface';
import { TabifyBaseInterface } from './base.interface';

export interface Like extends TabifyBaseInterface {
  story: Story;
  user: User;
}
