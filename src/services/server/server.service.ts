import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import config from "../../config";

@Injectable()
export class ServerService {
    constructor(private readonly httpClient: HttpClient) { }

    async getServerByRefCode(refCode: string) {
        return await this.httpClient.get(`${config.serverUrl}/server/getServerByRefCode/${refCode}`).toPromise();
    }
}