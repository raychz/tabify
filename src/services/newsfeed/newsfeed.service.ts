import { Injectable } from '@angular/core';
import { StoryService } from '../story/story.service';
import { AuthService } from '../auth/auth.service';
import { getStoryUsersDescription } from '../../utilities/ticket.utilities';

// This class holds that data structure that is used to represent content on the newsfeed
@Injectable()
export class NewsfeedService {

    // The data structure we get back is a uid, and a list of tickets.
    // Inside each ticket, there is a story object
    tickets: any = [];

    constructor(
        private storyService: StoryService,
        private authService: AuthService,
    ) { }

    async initializeNewsfeed() {
        await this.getUserTicketsFromServer();
        await this.determineStoriesLikedByUser();
        await this.userNamesDisplay();
    }

    async getUserTicketsFromServer() {
        const userTickets = await this.storyService.getUserStories();
        this.tickets = userTickets;
        console.log(this.tickets);
        return this.tickets;
    }

    async determineStoriesLikedByUser() {

        if (this.tickets && this.tickets.length > 0) {
            const loggedInUserId = this.authService.getUid();

            for (let i = 0; i < this.tickets.length; i++) {
                for (let j = 0; j < this.tickets[i].story.likes.length; j++) {
                    if (this.tickets[i].story.likes[j].user.uid === loggedInUserId) {
                        this.tickets[i].story.likedByLoggedInUser = true;
                        break;
                    }
                }
            }
        }
        return this.tickets;
    }

    /**
    * assigns an object to describe the users who have joined the tab.
    * Ex: Ray, Hassan, Sahil +3 others
    * @param users List of users
    * @param userDisplayLimit The max number of usernames to render. The rest of the users will be truncated and represented by "+x others", where x is the number of truncated users. Defaults to 3.
    */
    async userNamesDisplay() {
        for (let i = 0; i < this.tickets.length; i++) {
            this.tickets[i].userNamesDisplay =
                getStoryUsersDescription(this.tickets[i].users, 3);
        }
    }

    incrementCommentCount(ticketId: number, storyId: number) {
        this.tickets[this.findIndexOfTicket(ticketId, storyId)].story.comment_count += 1;
    }

    decrementCommentCount(ticketId: number, storyId: number) {
        this.tickets[this.findIndexOfTicket(ticketId, storyId)].story.comment_count -= 1;
    }

    addLike(ticketId: number, storyId: number, likeToBeAdded: any) {
        const indexOfTicket = this.findIndexOfTicket(ticketId, storyId);
        this.tickets[indexOfTicket].story.likes.push(likeToBeAdded);
        this.tickets[indexOfTicket].story.likedByLoggedInUser = true;
    }

    removeLike(ticketId: number, storyId: number) {
        const indexOfTicket = this.findIndexOfTicket(ticketId, storyId);
        const loggedInUserId = this.authService.getUid();
        this.tickets[indexOfTicket].story.likes = this.tickets[indexOfTicket].story.likes
            .filter((like: any) => like.user.uid !== loggedInUserId);

        this.tickets[indexOfTicket].story.likedByLoggedInUser = false;
    }

    loadingLike(ticketId: number, storyId: number, loading: boolean) {
        this.tickets[this.findIndexOfTicket(ticketId, storyId)].loadingLike = loading;
    }

    findIndexOfTicket(ticketId: number, storyId: number) {
        return this.tickets.findIndex(
            (ticket: any) => ((ticket.id === ticketId) && (ticket.story.id === storyId)));
    }

    clearFeed() {
        this.tickets = [];
    }
}