import { list } from '@keystone-next/keystone/schema';
import { text, integer, relationship } from '@keystone-next/fields';

export const Order = list({
  fields: {
    total: integer(),
    items: relationship({ ref: 'OrderItem.order', many: true }),
    user: relationship({ ref: 'User.orders' }),
    charge: text(),
  },
});
