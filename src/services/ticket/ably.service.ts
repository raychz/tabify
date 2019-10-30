import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@tabify/env';
import * as Ably from 'ably';
import { AblyTicketService } from './ably-ticket.service';

@Injectable()
export class AblyService {
  private realtime: Ably.Realtime;

  constructor(
    public ablyTicketService: AblyTicketService
  ) { }

  connect() {
    if (!this.realtime) {
      this.realtime = new Ably.Realtime({ key: environment.ablyKey });

      // await this.realtime.connection.once('connected');
      this.realtime.connection.on((stateChange) => {
        console.log('New Ably connection state is ' + stateChange.current);
      });

      this.realtime.connection.on('failed', this.onFailure.bind(this));
      // this.realtime.channels
      //   .get('test-ticket-id')
      //   .subscribe('ticket-item-added', (payload) => {
      //     this.ablyTicketService.onTicketUpdate(payload)
      //     console.log('CALLED ticket-item-added', payload);
      //   });
      // this.realtime.channels.
    } else {
      throw 'The Ably client is already connected, but a request to connect was attempted.';
    }
  }

  disconnect() {
    if (this.realtime) {
      this.realtime.close();
      this.realtime = null;
    } else {
      throw 'The Ably client is already disconnected, but a request to disconnect was attempted.';
    }
  }

  private onFailure() {
    console.error('The Ably connection has failed.');
    try {
      this.realtime.close();
    } catch (e) {
      console.error('An error occurred while closing the failed Ably connection.', e);
    }
    this.realtime = null;
  }
}
