'use client';

import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import CheckoutStepper from './CheckoutStepper';
import convertToSubcurrency from '@/app/lib/convertToSubcurrency';

if (process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY === undefined) {
  throw new Error('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is not defined');
}
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
);

interface CheckoutProps {
  total: number;
}

export default function Checkout({ total }: CheckoutProps) {
  const amount = convertToSubcurrency(total);

  return (
    <Elements
      stripe={stripePromise}
      options={{
        mode: 'payment',
        amount,
        currency: 'usd',
        paymentMethodTypes: ['card'],
        appearance: {
          theme: 'stripe',
          variables: {
            colorPrimary: '#000000',
            colorBackground: '#ffffff',
            colorText: '#000000',
            colorDanger: '#ff0000',
            fontFamily: 'system-ui, sans-serif',
            spacingUnit: '4px',
            borderRadius: '4px',
          },
        },
      }}
    >
      <CheckoutStepper total={total} />
    </Elements>
  );
}
