import { fetchCartItems } from '@/app/checkout/data';
import Link from 'next/link';
import Checkout from './components/Checkout/Checkout';
import CheckoutHeader from './components/CheckoutHeader';
import CartItems from './components/CartItems';

async function getCartData() {
  const { items } = await fetchCartItems();
  return items;
}

export default async function CheckoutPage() {
  const cartItems = await getCartData();
  const cartTotal = cartItems
    .reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 0), 0)
    .toFixed(2);

  const total = parseInt(cartTotal);

  return (
    <>
      <CheckoutHeader cartItemsLength={cartItems.length.toString()} />
      {cartItems.length === 0 ? (
        <div className='mb-4 w-full flex flex-col items-center justify-center'>
          <h1 className='font-bold text-2xl mt-16'>Cart is empty :,(</h1>
          <Link
            href='/products'
            className='text-blue-500 font-bold text-xl underline mt-4'
          >
            Return to Shop
          </Link>
        </div>
      ) : (
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4 text-xs'>
          <div className='p-8'>
            <h2 className='text-sm md:text-xl font-semibold mb-2'>
              Order Summary
            </h2>
            <h3>{cartItems.length} items</h3>
            {cartItems.map((item) => (
              <CartItems key={item.cart_item_id} item={item} />
            ))}
            <p className='font-bold text-sm md:text-xl text-right mt-4'>
              Total: ${total}
            </p>
          </div>

          <div className='bg-slate-200 p-8'>
            <Checkout total={total} />
          </div>
        </div>
      )}
    </>
  );
}
