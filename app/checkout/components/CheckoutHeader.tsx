import Link from 'next/link';
import { BiArrowToLeft } from 'react-icons/bi';

export default function CheckoutHeader({
  cartItemsLength,
}: {
  cartItemsLength: string;
}) {
  return (
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
        Checkout for {cartItemsLength} item{cartItemsLength === '1' ? '' : 's'}
      </p>
    </div>
  );
}
