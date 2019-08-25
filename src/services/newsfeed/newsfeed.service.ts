import { Injectable } from '@angular/core';
import { StoryService } from '../story/story.service';
import { AuthService } from '../auth/auth.service';
import { _localeFactory } from '@angular/core/src/application_module';

// This class holds that data structure that is used to represent content on the newsfeed
@Injectable()
export class NewsfeedService {

    // The data structure we get back is a uid, and a list of tickets.
    // Inside each ticket, there is a story object
    tickets: any;

    constructor(
        private storyService: StoryService,
        private authService: AuthService,
    ) { }

    async initializeNewsfeed() {
        await this.getUserTicketsFromServer();
        await this.determineStoriesLikedByUser();
    }

    async getUserTicketsFromServer() {
        const userTickets = await this.storyService.getUserStories();
        this.tickets = userTickets.tickets;
        return this.tickets;
    }

    async determineStoriesLikedByUser() {
        const loggedInUserId = this.authService.getUid();

        for (let i = 0; i < this.tickets.length; i++) {
            for (let j = 0; j < this.tickets[i].story.likes.length; j++) {
                if (this.tickets[i].story.likes[j].user.uid === loggedInUserId) {
                    this.tickets[i].story.likedByLoggedInUser = true;
                    break;
                }
                
            }
        }
        console.log(this.tickets);
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
        this.tickets[this.findIndexOfTicket(ticketId, storyId)].story.likedByLoggedInUser = true;
    }

    decrementLikeCount(ticketId: number, storyId: number) {
        this.tickets[this.findIndexOfTicket(ticketId, storyId)].story.like_count -= 1;
        this.tickets[this.findIndexOfTicket(ticketId, storyId)].story.likedByLoggedInUser = false;

    }

    loadingLike(ticketId: number, storyId: number, loading: boolean) {
        this.tickets[this.findIndexOfTicket(ticketId, storyId)].loadingLike = loading;
    }

    findIndexOfTicket(ticketId: number, storyId: number) {
        return this.tickets.findIndex(
            (ticket: any) => ((ticket.id === ticketId) && (ticket.story.id === storyId)));
    }
}