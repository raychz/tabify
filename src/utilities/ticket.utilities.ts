// Stateless ticket helper functions

import { abbreviateName } from './general.utilities';
import { FirestoreTicketItem } from '../services/ticket/ticket.service';

/**
 * Returns a string to describe the users who have claimed a ticket item.
 * Ex: "Ray and Hassan shared this."
 * @param users
 */
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

/**
 * Calculates the subtotal for the items that user with uid `uid` has claimed.
 * @param items All ticket items
 * @param uid Uid for the user whose subtotal is being calculated
 */
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

/**
 * Counts the number of items that user with uid `uid` has claimed.
 * @param items All ticket items
 * @param uid Uid for the user whose items are being counted
 */
export const countItemsOnMyTab = (items: FirestoreTicketItem[], uid: any): number => {
    console.log('counted items!');
    const myItems =
        items &&
        items.filter((item) => isItemOnMyTab(item, uid));
    return (myItems && myItems.length) || 0;
}

/**
 * Checks whether an item is claimed by user with uid `uid`.
 * @param item
 * @param uid
 */
export const isItemOnMyTab = (item: FirestoreTicketItem, uid: any) => {
    return !!item.users.find(user => user.uid === uid);
}

/**
 * Returns a string to describe the users who have joined the tab.
 * Ex: Ray, Hassan, Sahil +3 others
 * @param users List of users
 * @param userDisplayLimit The max number of usernames to render. The rest of the users will be truncated and represented by "+x others", where x is the number of truncated users. Defaults to 3.
 */
export const getTicketUsersDescription = (users: any[] = [], userDisplayLimit: number = 3) => {
    if (!users || users.length === 0) return 'No users on this tab.';

    const abbreviatedNames = users.map(user => abbreviateName(user.name));

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

/**
 * Returns the items that user with uid `uid` has claimed.
 * @param items
 * @param uid
 */
export const getItemsOnMyTab = (items: FirestoreTicketItem[], uid: any) => {
    return items.filter((item: FirestoreTicketItem) => item.users.find(user => user.uid === uid));
}
