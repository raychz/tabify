import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import config from "../../config";

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

    async createLike(storyId: number): Promise<any> {
        const response = await this.httpClient.post(`${config.serverUrl}/stories/${storyId}/likes`, {}).toPromise();

        console.log(response);
        return response;
    }
}