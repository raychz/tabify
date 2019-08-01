import { Injectable } from '@angular/core';
import { StoryService } from '../story/story.service';
import moment from 'moment';

// This class holds that data structure that is used to represent content on the newsfeed
@Injectable()
export class NewsfeedService {

    stories: any;

    constructor(private storyService: StoryService) { }

    async initializeNewsfeed() {
        await this.getUserStoriesFromServer();
    }

    async getUserStoriesFromServer() {
        let userstories = await this.storyService.getUserStories();

        userstories = userstories.tickets;

        this.stories = userstories.map((ticket: any) => ({
            ...ticket,
            timeStamp: moment(ticket.date_created).format('MMMM Do YYYY, h:mm a'),
        }));
        return this.stories;
    }

    incrementCommentCount(storyId: number) {
        this.stories[this.findIndexOfStory(storyId)].comment_count += 1;
    }

    decrementCommentCount(storyId: number) {
        this.stories[this.findIndexOfStory(storyId)].comment_count -= 1;
    }

    incrementLikeCount(storyId: number) {
        this.stories[this.findIndexOfStory(storyId)].like_count += 1;
    }

    decrementLikeCount(storyId: number) {
        this.stories[this.findIndexOfStory(storyId)].like_count -= 1;
    }

    findIndexOfStory(storyId: number) {
       return this.stories.findIndex((story: any) => story.id === storyId);
    }
}