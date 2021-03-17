import { list } from '@keystone-next/keystone/schema';
import { text, relationship } from '@keystone-next/fields';
import { cloudinaryImage } from '@keystone-next/cloudinary';
import { isSignedIn, permissions } from '../access';

export const cloudinary = {
  cloudName: process.env.CLOUDINARY_CLOUD_NAME,
  apiKey: process.env.CLOUDINARY_KEY,
  apiSecret: process.env.CLOUDINARY_SECRET,
  folder: 'sickfits',
};

export const ProductImage = list({
  access: {
    create: isSignedIn,
    read: () => true,
    update: permissions.canManageProducts,
    // only people with the permission can delete themselves!
    delete: permissions.canManageProducts,
  },
  // ui:
  fields: {
    image: cloudinaryImage({
      cloudinary,
      label: 'Source',
    }),
    altText: text({ isRequired: true, isUnique: true }),
    product: relationship({ ref: 'Product.photo' }),
    // TODO: add roles, cart and orders
  },
  ui: {
    listView: {
      initialColumns: ['image', 'altText', 'product'],
    },
  },
});
