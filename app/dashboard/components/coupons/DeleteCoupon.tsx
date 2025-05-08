'use client';
import { deleteCouponAction } from './actions';
import { FaTimes } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
export default function DeleteCoupon({ couponId }: { couponId: string }) {
  const router = useRouter();
  return (
    <button
      className='text-red-500 hover:text-red-600 cursor-pointer mt-1'
      onClick={() => {
        deleteCouponAction(couponId);
        router.refresh();
      }}
    >
      <FaTimes />
    </button>
  );
}
