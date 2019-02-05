import { Story } from './home';
let user: Story[] = [];

let global: Story[] = user;

let community: Story[] = [...user].reverse();

export { user, global, community };
