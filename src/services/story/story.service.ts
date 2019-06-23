import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import config from "../../config";

@Injectable()
export class StoryService {
    constructor(
        private readonly httpClient: HttpClient
    ) { }

    async getUserStories(): Promise<any> {
        return (
            this.httpClient.get(`${config.serverUrl}/stories`).toPromise()
        );
    }

    createLike(storyId: number) {
        return this.httpClient.post(`${config.serverUrl}/stories/${storyId}/likes`, {}).toPromise();
    }
}