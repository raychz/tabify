// Stateless ticket helper functions

import { abbreviateName } from './general.utilities';
import { FirestoreTicketItem } from '../services/ticket/ticket.service';
import { TicketUser } from '../interfaces/ticket-user.interface';
import { TicketItem } from '../interfaces/ticket-item.interface';
import { TicketItemUser } from '../interfaces/ticket-item-user.interface';

/**
 * Returns a string to describe the users who have claimed a ticket item.
 * Ex: "Ray and Hassan shared this."
 * @param ticketItemUsers
 */
export const getPayersDescription = (ticketItemUsers: TicketItemUser[]) => {
    const { length: numberOfPayers } = ticketItemUsers;

    let payersDescription = '';
    switch (numberOfPayers) {
        case 0:
            payersDescription = 'Nobody has claimed this.';
            break;
        case 1:
            payersDescription = `${abbreviateName(ticketItemUsers[0].user.userDetail.displayName)} got this.`;
            break;
        default: {
            const payersNamesMap = ticketItemUsers.map(p => abbreviateName(p.user.userDetail.displayName));
            payersDescription = `${payersNamesMap
                .slice(0, numberOfPayers - 1)
                .join(', ')} and ${payersNamesMap[numberOfPayers - 1]} shared this.`;
        }
    }
    return payersDescription;
}

/**
 * Checks whether an item is claimed by user with uid `uid`.
 * @param item
 * @param uid
 */
export const isItemOnMyTab = (item: TicketItem, uid: any) => {
    return !!item.users.find(u => u.user.uid === uid);
}

/**
 * Interface for the object returned by getStoryUsersDescription
 */
export interface IUsersDescription {
    mainUsers: string,
    hereClause: string,
    othersNum: string

}

/**
* For the newsfeed: Returns an object to describe the users who are part of a ticket / story.
* Ex: Ray, Hassan, Sahil +3 others
* @param users List of users
* @param userDisplayLimit The max number of usernames to render. The rest of the users will be truncated and represented by "+x others", where x is the number of truncated users. Defaults to 3.
*/
export const getStoryUsersDescription = (users: any[] = [], userDisplayLimit: number) => {

    const usersDescription: IUsersDescription = {
        mainUsers: '',
        hereClause: '',
        othersNum: null
    }

    if (!users || users.length === 0) {
        usersDescription.mainUsers = 'No users on this tab.';
        return usersDescription;
    }

    if (users.length > 1) {
        usersDescription.hereClause = 'were here'
    } else {
        usersDescription.hereClause = 'was here'
    }

    // abbreviateName is imported from general utilities
    const abbreviatedNames = users.map(user => abbreviateName(user.userDetail.displayName));

    if (abbreviatedNames.length > userDisplayLimit) {
        const overflowNames = abbreviatedNames.splice(userDisplayLimit);
        const othersNum = `+${overflowNames.length} other${
            overflowNames.length > 1 ? 's' : ''
            }`;
        usersDescription.othersNum = othersNum;
        usersDescription.mainUsers = abbreviatedNames.join(', ');
    }

    if (users.length < userDisplayLimit) {
        usersDescription.mainUsers = abbreviatedNames.join(' and ');
    } else {
        usersDescription.mainUsers = abbreviatedNames.join(', ');
    }

    return usersDescription;
}

/**
 * For the select-items page: Returns a string to describe the users who have joined the ticket/story.
 * Ex: Ray, Hassan, Sahil +3 others
 * @param users List of users
 * @param userDisplayLimit The max number of usernames to render. The rest of the users will be truncated and represented by "+x others", where x is the number of truncated users. Defaults to 3.
 */
export const getSelectItemsTicketUsersDescription = (users: TicketUser[] = [], userDisplayLimit: number = 3) => {
    if (!users || users.length === 0) return 'No users on this tab.';

    const abbreviatedNames = users.map(u => abbreviateName(u.user.userDetail.displayName));

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
export const getItemsOnMyTab = (items: FirestoreTicketItem[] = [], uid: any) => {
    return items.filter((item: FirestoreTicketItem) => item.users.find(user => user.uid === uid));
}

export const findUserShareOfItem = (item: TicketItem, uid: string) => {
    const ticketItemUser = item.users.find(u => u.user.uid === uid);
    if (ticketItemUser) return ticketItemUser.price;
    return 0;
}