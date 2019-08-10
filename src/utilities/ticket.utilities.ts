// Stateless ticket helper functions

import { abbreviateName } from './general.utilities';
import { FirestoreTicketItem } from '../services/ticket/ticket.service';

export const getPayersDescription = (users: any[]) => {
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

export const getSubtotal = (items: FirestoreTicketItem[], uid: any) => {
    let sum = 0;
    items &&
        items.forEach(item => {
            const payer = item.users.find(
                (e: { uid: string | null }) => e.uid === uid
            );
            if (payer) {
                sum += payer.price;
            }
        });
    return sum;
}

export const countItemsOnMyTab = (items: FirestoreTicketItem[], uid: any): number => {
    console.log('counted items!');
    const myItems =
        items &&
        items.filter((item) => isItemOnMyTab(item, uid));
    return (myItems && myItems.length) || 0;
}

export const isItemOnMyTab = (item: FirestoreTicketItem, uid: any) => {
    return !!item.users.find(user => user.uid === uid);
}

export const getTicketUsersDescription = (users: any[] = []) => {
    if (!users || users.length === 0) return 'No users on this tab.';

    const abbreviatedNames = users.map(user => abbreviateName(user.name));

    const userDisplayLimit = 3;
    if (abbreviatedNames.length > userDisplayLimit) {
        const overflowNames = abbreviatedNames.splice(userDisplayLimit);
        const others = `+${overflowNames.length} other${
            overflowNames.length > 1 ? 's' : ''
            }`;
        const othersContainer = `<span class='plus-others'>${others}</span>`;
        return `${abbreviatedNames.join(', ')} ${othersContainer}`;
    }
    return abbreviatedNames.join(', ');
}

export const getItemsOnMyTab = (items: FirestoreTicketItem[], uid: any) => {
    return items.filter((item: any) =>
        item.users.find((e: any) => e.uid === uid)
    )
}