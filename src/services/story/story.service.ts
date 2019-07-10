import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import config from "../../config";
import { observable } from "rxjs";

@Injectable()
export class StoryService {
    constructor(
        private readonly httpClient: HttpClient
    ) { }

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

        console.log(res);
    }

    async createComment(storyId: number, newComment: string) {
        const res = await this.httpClient.post(`${config.serverUrl}/stories/${storyId}/comments`,
            { newComment: newComment }, { observe: 'response' }).toPromise();

        return res.status;
    }
}