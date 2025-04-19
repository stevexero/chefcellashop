import { Suspense } from 'react';
import CardWrapper from '@/app/products/components/products/cards';
import { CardsSkeleton } from '@/app/ui/skeletons';

export default async function Page() {
  return (
    <main>
      <h1 className='font-bold text-lg text-center mt-8'>T-SHIRTS</h1>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 my-8'>
        <Suspense fallback={<CardsSkeleton />}>
          <CardWrapper />
        </Suspense>
      </div>
    </main>
  );
}
