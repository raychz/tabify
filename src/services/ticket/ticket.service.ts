import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Ticket } from '../../models/Ticket';
import { sleep } from '../../utilities/utils';
import config from '../../config';
import { FirestoreService } from '../firestore/firestore.service';
import { tap } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';
import currency from 'currency.js';
import { abbreviateName } from '../../utilities/utils';

@Injectable()
export class TicketService {
  constructor(
    private readonly http: HttpClient,
    private firestoreService: FirestoreService,
    private auth: AuthService
  ) {}

  async getTicket(tab_id: string, omnivoreLocationId: string) {
    try {
      const params = {
        ticket_number: tab_id,
        location: String(omnivoreLocationId),
      };
      const ticket = await this.http
        .get(`${config.serverUrl}/ticket`, { params })
        .toPromise();

      return {
        ticket: ticket,
        error: null,
      };
    } catch (error) {
      return {
        ticket: null,
        error: error,
      };
    }
  }

  getFirestoreTicket(ticketId: number) {
    return this.firestoreService
      .document$(`tickets/${ticketId}/`)
      .pipe(tap(val => console.log(`firestore ticket:`, val)));
  }

  getFirestoreTicketItems(ticketId: number) {
    return this.firestoreService
      .collection$(`tickets/${ticketId}/ticketItems`)
      .pipe(tap(val => console.log(`ticket items:`, val)));
  }

  async addUserToFirestoreTicketItem(
    ticketId: any,
    ticketItemId: any
  ): Promise<{ success: boolean; message: string }> {
    try {
      await this.firestoreService.runTransaction(async transaction => {
        const ticketItemDocRef = this.firestoreService.document(
          `tickets/${ticketId}/ticketItems/${ticketItemId}`
        ).ref;
        const ticketItem = await transaction.get(ticketItemDocRef);
        if (!ticketItem.exists) {
          throw 'Document does not exist!';
        }
        const uid = this.auth.getUid();
        const displayName = this.auth.getDisplayName();

        let { users, price } = ticketItem.data()! as {
          users: any[];
          price: number;
        };

        if (users.find(u => u.uid === uid))
          throw 'This item has already been added to your tab.';
        users.push({
          uid: this.auth.getUid(),
          name: this.auth.getDisplayName(),
          price: 0,
        });

        const { length: numberOfPayers } = users;
        currency(price)
          .distribute(numberOfPayers)
          .forEach((d, index) => {
            users[index].price = d.value;
          });

        const payersDescription = this.getPayersDescription(users);
        return transaction.set(
          ticketItemDocRef,
          { payersDescription, users },
          { merge: true }
        );
      });
      return {
        success: true,
        message: 'Ticket item added to tab successfully.',
      };
    } catch (error) {
      console.log('transaction failed', error);
      return {
        success: false,
        message: error,
      };
    }
  }

  async removeUserFromFirestoreTicketItem(
    ticketId: any,
    ticketItemId: any
  ): Promise<{ success: boolean; message: string }> {
    try {
      await this.firestoreService.runTransaction(async transaction => {
        const ticketItemDocRef = this.firestoreService.document(
          `tickets/${ticketId}/ticketItems/${ticketItemId}`
        ).ref;
        const ticketItem = await transaction.get(ticketItemDocRef);
        if (!ticketItem.exists) {
          throw 'Document does not exist!';
        }
        const uid = this.auth.getUid();
        const displayName = this.auth.getDisplayName();

        let { users, price } = ticketItem.data()! as {
          users: any[];
          price: number;
        };

        if (!users.find(u => u.uid === uid))
          throw 'This item has already been removed from your tab.';

        users = users.filter(u => u.uid !== uid);
        const { length: numberOfPayers } = users;
        currency(price)
          .distribute(numberOfPayers)
          .forEach((d, index) => {
            users[index].price = d.value;
          });

        const payersDescription = this.getPayersDescription(users);
        return transaction.set(
          ticketItemDocRef,
          { payersDescription, users },
          { merge: true }
        );
      });
      return {
        success: true,
        message: 'Ticket item removed from tab successfully.',
      };
    } catch (error) {
      console.log('Transaction failed', error);
      return {
        success: false,
        message: error,
      };
    }
  }

  private getPayersDescription(users: any[]) {
    const { length: numberOfPayers } = users;

    let payersDescription = '';
    switch (numberOfPayers) {
      case 0:
        payersDescription = 'Nobody has claimed this.';
        break;
      case 1:
        payersDescription = `${abbreviateName(users[0].name)} got this.`;
        break;
      default: {
        const payersNamesMap = users.map(p => abbreviateName(p.name));
        payersDescription = `${payersNamesMap
          .slice(0, numberOfPayers - 1)
          .join(', ')} and ${payersNamesMap[numberOfPayers - 1]} shared this.`;
      }
    }
    return payersDescription;
  }
}
