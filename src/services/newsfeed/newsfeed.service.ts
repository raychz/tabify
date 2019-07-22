import { Injectable } from '@angular/core';
import { StoryService } from '../story/story.service';
import moment from 'moment';

// This class holds that data structure that is used to represent content on the newsfeed
@Injectable()
export class NewsfeedService {

    public stories: any;

    constructor(private storyService: StoryService) { 
    }

    async getUserStories() {
        const userStories = await this.storyService.getUserStories();
        this.stories = userStories.map((story: any) => ({
            ...story,
            timeStamp: moment(story.ticket.date_created).format('MMMM Do YYYY, h:mm a'),
        }));
        return this.stories;
    }

    async initializeNewsfeed() {
        await this.getUserStories();
    }
}