'use client';

import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { removeCouponAction } from '../actions';

interface Props {
  cartId: string;
}

export default function RemoveCouponButton({ cartId }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    startTransition(async () => {
      await removeCouponAction(cartId);
      router.refresh();
    });
  };

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      className='max-w-md self-end bg-white border border-red-500 text-red-500 p-2 rounded-md mt-4 disabled:opacity-50 cursor-pointer'
    >
      {isPending ? 'Removing…' : 'Remove Coupon'}
    </button>
  );
}
