import { Injectable } from '@angular/core';
import { StoryService } from '../story/story.service';
import moment from 'moment';

@Injectable()
export class NewsfeedService {

    public stories: any;

    constructor(private storyService: StoryService) { 
    }

    async getUserStories() {
        console.log('yoooooooo');
        const userStories = await this.storyService.getUserStories();
        this.stories = userStories.map((story: any) => ({
            ...story,
            timeStamp: moment(story.ticket.date_created).format('MMMM Do YYYY, h:mm a'),
        }));
        return this.stories;
        console.log('testing this', this.stories);
    }

    async initializeStories() {
        await this.getUserStories();
    }
}