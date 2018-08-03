import { Injectable } from '@angular/core';
import { ExtendedSocket } from './socket';

@Injectable()
export class SocketService {
  constructor(public socket: ExtendedSocket) {
    this.socket.connect();
  }

  joinRoom(room: string) {
    this.socket.emit('join', room);
  }

  sendMessage(msg: any) {
    this.socket.emit('message-room', msg);
  }

  getMessage() {
    return this.socket.fromEvent('message-room').map(data => data);
  }
}
