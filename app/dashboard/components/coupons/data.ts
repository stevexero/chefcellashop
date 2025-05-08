'use server';

export async function getCoupons() {
  const coupons = await fetch('/api/get-all-coupons');
  const couponsData = await coupons.json();
  return couponsData;
}
