import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import config from "../../config";

@Injectable()
export class StoryService {
    
    constructor(private readonly httpClient: HttpClient) { }

    // get stories that a user was part of (personal feed)
    async getUserStories(): Promise<any> {
        return await this.httpClient.get(`${config.serverUrl}/stories`).toPromise();
    }

    async getStory(storyId: number): Promise<any> {
        return await this.httpClient.get(`${config.serverUrl}/stories/${storyId}`).toPromise();
    }

    // get comments for a story
    async getComments(storyId: number): Promise<any> {
        return await this.httpClient.get(`${config.serverUrl}/stories/${storyId}/comments`).toPromise();
    }

    async createLike(storyId: number) {
        const res = await this.httpClient.post(`${config.serverUrl}/stories/${storyId}/likes`, {}, { observe: 'response' })
            .toPromise();

        return res;
    }

    async deleteComment(storyId: number, commentId: number) {
        const res = await this.httpClient.delete(`${config.serverUrl}/stories/${storyId}/comments/${commentId}`,
            { observe: 'response' }).toPromise();

        return res;
    }
    
    async createComment(storyId: number, newComment: string) {
        const res = await this.httpClient.post(`${config.serverUrl}/stories/${storyId}/comments`,
            { newComment: newComment }, { observe: 'response' }).toPromise();

        return res;
    }

    async getStoryLikers(storyId: number) {
        const res = await this.httpClient.get(`${config.serverUrl}/stories/${storyId}/likers`).toPromise();
        return res;
    }
}