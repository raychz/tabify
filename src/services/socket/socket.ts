import { Injectable } from '@angular/core';
import { Socket } from 'ng-socket-io';
import { Platform } from 'ionic-angular';

@Injectable()
export class ExtendedSocket extends Socket {
  constructor(public platform: Platform) {
    super({
      url: platform.is('android')
        ? 'http://192.168.1.31:3000'
        : 'http://localhost:3000',
      options: {},
    });
    console.log('IS PLATFORM RUNNING ANRDOIRD '), platform.is('android');
    console.log('HERE');
  }
}
