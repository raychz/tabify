import { Injectable } from '@angular/core';
import { Socket } from 'ng-socket-io';
import { Platform } from 'ionic-angular';
import {AuthService} from "../auth/auth.service";

@Injectable()
export class ExtendedSocket extends Socket {
  constructor(public platform: Platform, authService: AuthService) {
    super({
      url: platform.is('android')
        ? 'http://192.168.1.31:3000/ticket-events'
        : 'http://localhost:3000/ticket-events',
      options: {
        query: {
          uid: authService.getUid(),
        }
      },
    });
    console.log('IS PLATFORM RUNNING ANRDOIRD ', platform.is('android'));
    console.log('HERE');
  }
}
