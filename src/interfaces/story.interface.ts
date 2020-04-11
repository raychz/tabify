import { Ticket } from "./ticket.interface";
import { Like } from "./like.interface";
import { Comment } from "./comment.interface";

export interface Story {
  id: number;
  comments: Comment[];
  comment_count: number;
  likes: Like[];
  ticket: Ticket;
  date_created: Date;
}