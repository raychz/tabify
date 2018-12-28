import { Injectable } from '@angular/core';
import { Socket } from 'ng-socket-io';
import { Platform } from 'ionic-angular';
import { AuthService } from "../auth/auth.service";

@Injectable()
export class ExtendedSocket extends Socket {
  private readonly HOST = platform.is('android')
      ? 'http://192.168.1.31'
      : 'http://localhost';
  private readonly PORT = 3000;
  private readonly NSPS = 'ticket-events';

  constructor(public platform: Platform, public authService: AuthService) {
    const url = `${this.HOST}:${this.PORT}/${this.NSPS}`;
    const options = {
      query: {
        'uid': this.authService.getUid(),
      }
    };
    super({ url, options });


    console.log('IS PLATFORM RUNNING ANRDOIRD '), platform.is('android');
    console.log('HERE');
  }

  connect() {
    super.connect();
  }
}
