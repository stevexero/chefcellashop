import React from 'react';
import { createClient } from '@/app/lib/supabase/server';
import DeleteCoupon from './DeleteCoupon';
interface Coupon {
  coupon_id: string;
  code: string;
  type: string;
  amount_off: number;
  percent_off: number;
  bogo_product: string;
  one_time: boolean;
  per_user: boolean;
  usage_limit: number;
  used_count: number;
  valid_from: string;
  valid_until: string;
  active: boolean;
}

export default async function CouponsList() {
  const supabase = await createClient();
  const { data, error } = await supabase.from('coupons').select('*');

  if (error) {
    console.error(error);
  }

  return (
    <div className='mt-12 p-4 border border-slate-300 shadow-xl shadow-slate-400 rounded-2xl'>
      <h2 className='text-2xl font-bold'>Coupons ({data?.length})</h2>
      <div className='overflow-x-auto'>
        <table className='min-w-full divide-y divide-gray-200'>
          <thead className='bg-gray-50'>
            <tr>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Code
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Type
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Amount Off
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Percent Off
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                BoGo UUID
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                One Time
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Per User
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Usage Limit
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Used Count
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Valid From
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Valid To
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Active
              </th>
            </tr>
          </thead>
          <tbody className='bg-white divide-y divide-gray-200'>
            {data?.map((coupon: Coupon) => (
              <tr key={coupon.coupon_id}>
                <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
                  {coupon.code}
                </td>
                <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                  {coupon.type}
                </td>
                <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                  {coupon.amount_off}
                </td>
                <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                  {coupon.percent_off}
                </td>
                <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                  {coupon.bogo_product}
                </td>
                <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                  {coupon.one_time}
                </td>
                <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                  {coupon.per_user}
                </td>
                <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                  {coupon.usage_limit === null
                    ? 'No Limit'
                    : coupon.usage_limit}
                </td>
                <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                  {coupon.used_count}
                </td>
                <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                  {new Date(coupon.valid_from).toLocaleDateString()}
                </td>
                <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                  {new Date(coupon.valid_until).toLocaleDateString()}
                </td>
                <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                  {coupon.active ? 'Yes' : 'No'}
                </td>
                {/* <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                  <Link href={`/orders/${order.order_id}`}>
                    <FaEye />
                  </Link>
                </td> */}
                <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                  <DeleteCoupon couponId={coupon.coupon_id} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
