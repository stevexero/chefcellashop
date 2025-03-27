// import { Suspense } from 'react';
import { fetchCartItems } from '@/app/lib/data/data';
import Link from 'next/link';
import Checkout from '../components/Checkout/Checkout';
import { BiArrowToLeft } from 'react-icons/bi';

async function getCartData() {
  const { items } = await fetchCartItems();
  return items;
}

export default async function CheckoutPage() {
  const cartItems = await getCartData();
  const cartTotal = cartItems
    .reduce((sum, item) => sum + item.price * item.quantity, 0)
    .toFixed(2);

  const total = parseInt(cartTotal);

  return (
    <>
      <div className='flex flex-row items-center justify-between p-4 border-b border-b-slate-300'>
        <Link
          href='/products'
          className='flex flex-row items-center text-sm text-slate-500'
        >
          <BiArrowToLeft />
          &nbsp;Continue Shopping
        </Link>
        <h1 className='hidden md:block text-2xl font-bold text-center'>
          Checkout
        </h1>
        <p className='text-sm text-slate-500'>
          Checkout for {cartItems.length} items
        </p>
      </div>
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
              <div key={item.cart_item_id} className='border-b py-2'>
                <p className='font-semibold text-sm md:text-xl'>
                  {item.products[0]?.product_name
                    .replaceAll('-', ' ')
                    .toUpperCase() || 'Unknown'}
                </p>
                <div className='grid grid-cols-4 gap-2'>
                  <p className='text-sm md:text-lg'>
                    <span className='font-semibold'>Size:</span>{' '}
                    {item.sizes?.[0]?.size || 'N/A'}
                  </p>
                  <p className='text-sm md:text-lg'>
                    <span className='font-semibold'>Color:</span>{' '}
                    {item.colors?.[0]?.color_name || 'N/A'}
                  </p>
                  <p className='text-sm md:text-lg'>
                    <span className='font-semibold'>Quantity:</span>{' '}
                    {item.quantity}
                  </p>
                  <p className='text-sm md:text-lg'>
                    <span className='font-semibold'>Price:</span> $
                    {(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              </div>
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
