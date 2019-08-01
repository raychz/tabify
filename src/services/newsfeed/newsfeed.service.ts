import { Injectable } from '@angular/core';
import { StoryService } from '../story/story.service';
import moment from 'moment';

// This class holds that data structure that is used to represent content on the newsfeed
@Injectable()
export class NewsfeedService {

    // The data structure we get back is a uid, and a list of tickets.
    // Inside each ticket, there is a story object
    tickets: any;

    constructor(private storyService: StoryService) { }

    async initializeNewsfeed() {
        await this.getUserticketsFromServer();
    }

    async getUserticketsFromServer() {
        let usertickets = await this.storyService.getUserStories();

        usertickets = usertickets.tickets;

        this.tickets = usertickets.map((ticket: any) => ({
            ...ticket,
            story: {
                ...ticket.story,
                timeStamp: moment(ticket.story.date_created).format('MMMM Do YYYY, h:mm a'),
            }
        }));

        console.log(this.tickets)
        return this.tickets;
    }

    incrementCommentCount(ticketId: number, storyId: number) {
        this.tickets[this.findIndexOfTicket(ticketId, storyId)].story.comment_count += 1;
    }

    decrementCommentCount(ticketId: number, storyId: number) {
        this.tickets[this.findIndexOfTicket(ticketId, storyId)].story.comment_count -= 1;
    }

    incrementLikeCount(ticketId: number, storyId: number) {
        this.tickets[this.findIndexOfTicket(ticketId, storyId)].story.like_count += 1;
    }

    decrementLikeCount(ticketId: number, storyId: number) {
        this.tickets[this.findIndexOfTicket(ticketId, storyId)].story.like_count -= 1;
    }

    findIndexOfTicket(ticketId: number, storyId: number) {
        return this.tickets.findIndex(
            (ticket: any) => ((ticket.id === ticketId) && (ticket.story.id === storyId)));
    }
}