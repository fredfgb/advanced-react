export default function calcTotalPrice(cart) {
  return cart.reduce((acc, cartItem) => {
    if (!cartItem.product) return acc; // products can be deleted, but they still be in your cart
    return acc + cartItem.quantity * cartItem.product.price;
  }, 0);
}
