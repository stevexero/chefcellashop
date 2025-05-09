import OrderSummary from '@/app/payment-success/components/orderSummary/OrderSummary';
import Link from 'next/link';
import { Suspense } from 'react';

export default async function PaymentSuccess(props: {
  searchParams: Promise<{
    amount: string;
    payment_intent: string;
    payment_intent_client_secret: string;
    redirect_status: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const {
    amount,
    payment_intent,
    // payment_intent_client_secret,
    redirect_status,
  } = searchParams;

  return (
    <main className='max-w-6xl mx-auto p-10 text-black text-center border border-slate-500 m-10 rounded-md'>
      <div className='mb-10'>
        <h1 className='text-4xl font-extrabold mb-2'>Thank you!</h1>
        <h2 className='text-2xl'>Your order has been received</h2>

        <div className='p-2 text-black mt-5 text-2xl font-bold'>
          ${parseFloat(amount).toFixed(2)}
        </div>
        <Link href='/' className='text-blue-500 text-lg underline'>
          Back to home
        </Link>
      </div>
      <Suspense fallback={<div>Loading...</div>}>
        <OrderSummary
          paymentId={payment_intent}
          // clientSecret={payment_intent_client_secret}
          redirectStatus={redirect_status}
        />
      </Suspense>
    </main>
  );
}
