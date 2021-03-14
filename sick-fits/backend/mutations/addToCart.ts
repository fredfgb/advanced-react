/* eslint-disable */
import { KeystoneContext } from '@keystone-next/types';
import { Session } from '../types';
import { CartItemCreateInput } from '../.keystone/schema-types';

async function addToCart(
    root: any,
    { productId }: { productId: string },
    context: KeystoneContext
): Promise<CartItemCreateInput> {
    console.log('adding to cart');
    // 1. Query the current user and see if they are signed in
    const sesh = context.session as Session;
    if (!sesh.itemId) {
        throw new Error('You must be logged in to do this!');
    }
    // 2. QUery current users cart
    const allCartItems = await context.lists.CartItem.findMany({
        where: { user: { id: sesh.itemId }, product: { id: productId } },
        resolveFields: 'id, quantity'
    });
    console.log(allCartItems);
    const [existingCartItem] = allCartItems;
    if (existingCartItem) {
        console.log(`There are already ${existingCartItem.quantity}, increment by 1!`);
        // 3. check if the item is already in their cart
        // 4. if it is increment by one
        return await context.lists.CartItem.updateOne({
            id: existingCartItem.id,
            data: { quantity: existingCartItem.quantity + 1 },
            resolveFields: 'id, quantity'
        });
    }
    // 4. if it isnt, create a new cart
    return await context.lists.CartItem.createOne({
        data: {
            product: { connect: { id: productId } },
            user: { connect: { id: sesh.itemId } },
            quantity: 1
        },
        resolveFields: 'id, quantity'
    })
}

export default addToCart;
