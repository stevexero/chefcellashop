'use client';

import { useState } from 'react';
import { applyCouponAction, updateCartTotalAction } from '../actions';
import { CartItem } from '@/app/types/types';
import { useRouter } from 'next/navigation';
import RemoveCouponButton from './RemoveCouponButton';
export default function Coupon({ cartItems }: { cartItems: CartItem[] }) {
  const router = useRouter();
  const [coupon, setCoupon] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const couponUpper = coupon.trim().toUpperCase();

    try {
      const response = await applyCouponAction(couponUpper);
      if (response.error) {
        setError('Coupon code is invalid');
        setCoupon('');
        setSuccess('');
      } else {
        setSuccess(response.message!);
        setCoupon('');
        setError('');
        if (response.coupon.type === 'percent_off') {
          const percent = response.coupon.percent_off / 100;
          await Promise.all(
            cartItems.map((item) => {
              const discountedPrice = Number(
                (item.price! * (1 - percent)).toFixed(2)
              );
              return updateCartTotalAction(
                // item.cart_id!,
                item.cart_item_id!,
                discountedPrice,
                item.price!,
                response.coupon.coupon_id
              );
            })
          );
        } else {
          const perItemDiscount = response.coupon.amount_off / cartItems.length;

          await Promise.all(
            cartItems.map((item) => {
              const discountedPrice = Number(
                (item.price! - perItemDiscount).toFixed(2)
              );
              return updateCartTotalAction(
                // item.cart_id!,
                item.cart_item_id!,
                discountedPrice,
                item.price!,
                response.coupon.coupon_id
              );
            })
          );
        }
      }

      router.refresh();
    } catch (error) {
      console.error(error);
      setError('Coupon code is invalid');
      setCoupon('');
      setSuccess('');
    } finally {
      setCoupon('');
    }
  };

  return (
    <form className='mt-4 flex flex-col' onSubmit={handleSubmit}>
      <p className='text-sm md:text-lg font-semibold mb-2'>Coupon Code</p>
      <input
        type='text'
        className='w-full p-2 border border-gray-300 rounded-md'
        value={coupon}
        onChange={(e) => setCoupon(e.target.value)}
        placeholder={
          cartItems[0].coupon_id
            ? 'Coupon already applied'
            : 'Enter coupon code'
        }
        disabled={cartItems[0].coupon_id ? true : false}
      />
      {cartItems[0].coupon_id ? (
        <RemoveCouponButton cartId={cartItems[0].cart_id!} />
      ) : (
        <button
          type='submit'
          className='w-full md:max-w-md self-end button-85 text-white p-2 rounded-md mt-4 disabled:opacity-50 disabled:cursor-not-allowed'
          disabled={cartItems[0].coupon_id ? true : false}
        >
          Apply Coupon Code
        </button>
      )}

      {error && <p className='text-red-500'>{error}</p>}
      {success && cartItems[0].coupon_id && (
        <p className='text-green-500'>{success}</p>
      )}
    </form>
  );
}
