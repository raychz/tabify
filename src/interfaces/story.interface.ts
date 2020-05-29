import { Ticket } from './ticket.interface';
import { Like } from './like.interface';
import { Comment } from './comment.interface';
import { TabifyBaseInterface } from './base.interface';

export interface Story extends TabifyBaseInterface {
  comments: Comment[];
  comment_count: number;
  likes: Like[];
  ticket: Ticket;
}
