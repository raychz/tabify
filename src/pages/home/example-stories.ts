import { Story } from './home';
let user: Story[] = [
  {
    location: {
      name: 'The Smoke Shop BBQ',
      city: 'Cambridge, MA',
      streetAddress: '25 Hampshire St.',
      distance: 0.01,
      photoUrl: 'assets/imgs/restaurants/smokeshop.png',
    },
    members: ['Ray', 'John'],
    timestamp: '8:30 PM, June 30',
    likes: 4,
    comments: 3,
  },
  {
    location: {
      name: "Mamaleh's Delicatessen",
      city: 'Cambridge, MA',
      streetAddress: '15 Hampshire St.',
      distance: 0.01,
      photoUrl: 'assets/imgs/restaurants/mamalehs.png',
    },
    members: ['Ray', 'John'],
    timestamp: '8:30 PM, June 30',
    likes: 4,
    comments: 3,
  },
  {
    location: {
      name: 'Naco Taco',
      city: 'Cambridge, MA',
      streetAddress: '297 Massachusetts Ave.',
      distance: 0.6,
      photoUrl: 'assets/imgs/restaurants/naco-taco.png',
    },
    members: ['Ray', 'John'],
    timestamp: '8:30 PM, June 30',
    likes: 4,
    comments: 3,
  },
  {
    location: {
      name: 'The Smoke Shop BBQ',
      city: 'Cambridge, MA',
      streetAddress: '25 Hampshire St.',
      distance: 0.01,
      photoUrl: 'assets/imgs/restaurants/smokeshop.png',
    },
    members: ['Ray', 'John'],
    timestamp: '8:30 PM, June 30',
    likes: 4,
    comments: 3,
  },
  {
    location: {
      name: 'Naco Taco',
      city: 'Cambridge, MA',
      streetAddress: '297 Massachusetts Ave.',
      distance: 0.6,
      photoUrl: 'assets/imgs/restaurants/naco-taco.png',
    },
    members: ['Ray', 'John'],
    timestamp: '8:30 PM, June 30',
    likes: 4,
    comments: 3,
  },
];

let global: Story[] = user;

let community: Story[] = [...user].reverse();

export { user, global, community };
