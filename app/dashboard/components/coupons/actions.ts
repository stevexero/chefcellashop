'use server';

import { createClient } from '@/app/lib/supabase/server';

interface Coupon {
  code: string;
  type: string;
  amountOff: number;
  percentOff: number;
  validFrom: string;
  validUntil: string;
}
export async function addCoupon(coupon: Coupon) {
  const code = coupon.code;
  const type = coupon.type;
  const amountOff = coupon.amountOff;
  const percentOff = coupon.percentOff;
  const validFrom = coupon.validFrom;
  const validUntil = coupon.validUntil;

  const supabase = await createClient();
  const { data, error } = await supabase.from('coupons').insert({
    code,
    type,
    amount_off: amountOff,
    percent_off: percentOff,
    valid_from: validFrom,
    valid_until: validUntil,
  });

  if (error) {
    console.error(error);
  }

  return data;
}

// TODO: Add update coupon

// TODO: Add delete coupon
export async function deleteCouponAction(couponId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('coupons')
    .delete()
    .eq('coupon_id', couponId);

  if (error) {
    console.error(error);
  }

  return data;
}
