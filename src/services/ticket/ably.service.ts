import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@tabify/env';
import * as Ably from 'ably';
import * as AblyPromises from 'ably/promises';
import { AblyTicketService } from './ably-ticket.service';
import { AuthService } from '../../services/auth/auth.service';

@Injectable({ providedIn: 'root' })
export class AblyService {
  private realtime: AblyPromises.Realtime;

  constructor(
    public auth: AuthService,
  ) { }

  connect() {
    if (!this.realtime) {
      this.realtime = new AblyPromises.Realtime.Promise({ key: environment.ablyKey, clientId: this.auth.getUid() });

      this.realtime.connection.on((stateChange) => {
        console.log('New Ably connection state is ' + stateChange.current);
      });

      this.realtime.connection.on('failed', this.onFailure.bind(this));
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

  getChannel(channel: string, channelOptions?: Ably.Types.ChannelOptions) {
    return this.realtime.channels.get(channel, channelOptions);
  }

  async detachChannel(channel: Ably.Types.RealtimeChannelPromise) {
    await channel.detach();
  }

  private onFailure() {
    console.error('The Ably connection has failed.');
    try {
      this.realtime.close();
    } catch (e) {
      console.error('An error occurred while closing the failed Ably connection.', e);
      throw e;
    }
    this.realtime = null;
  }
}
