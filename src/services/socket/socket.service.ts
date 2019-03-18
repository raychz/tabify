import { Injectable } from '@angular/core';
import { Socket } from 'ng-socket-io';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class SocketService {
  socket!: Socket;
  constructor(public auth: AuthService) { }

  public async connect() {
    const token = await this.auth.getToken().toPromise();
    const config = {
      url: 'http://localhost:3000/ticket-events',
      options: {
        query: {
          uid: this.auth.getUid(),
          token
        }
      }
    }

    this.socket = new Socket(config)
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
