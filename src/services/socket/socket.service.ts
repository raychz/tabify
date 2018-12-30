import { Injectable } from '@angular/core';
import { ExtendedSocket } from './socket';

@Injectable()
export class SocketService {
  constructor(public socket: ExtendedSocket) {}

  public connect() {
    this.socket.connect();
  }

  public disconnect() {
    this.socket.removeAllListeners();
    this.socket.disconnect();
  }

  joinRoom(room: string) {
    this.socket.emit('JOIN_TICKET_ROOM', room);
  }

  sendMessage(msg: any) {
    this.socket.emit('message-room', msg);
  }

  getMessage(event: string) {
    return this.socket.fromEvent(event).map(data => data);
  }
}
