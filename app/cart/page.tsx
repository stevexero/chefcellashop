import { Suspense } from 'react';
import CartDetails from '../components/cartDetails/CartDetails';

export default function page() {
  return (
    <Suspense>
      <CartDetails />
    </Suspense>
  );
}
