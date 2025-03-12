import { Suspense } from 'react';
import CardWrapper from '@/app/ui/products/cards';
import { CardsSkeleton } from '@/app/ui/skeletons';

export default async function Page() {
  return (
    <main>
      <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-4'>
        <Suspense fallback={<CardsSkeleton />}>
          <CardWrapper />
        </Suspense>
      </div>
    </main>
  );
}
