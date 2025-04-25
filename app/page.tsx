import Link from 'next/link';
import CardWrapper from './products/components/products/cards';
import { Suspense } from 'react';
import { CardsSkeleton } from './ui/skeletons';
import MailingListForm from './components/mailingList/MailingListForm';

export default async function Home() {
  return (
    <div className='w-full font-[family-name:var(--font-inter)] p-4 md:p-0'>
      <main className='w-full flex flex-col items-center justify-center mt-6'>
        <h1 className='text-3xl font-bold text-center'>What Up Y&apos;all!</h1>
        <div
          className='w-full h-[450px] mt-4 flex flex-col items-center justify-between p-8'
          style={{
            backgroundImage: `url(hero_img.png)`,
            backgroundSize: 'cover',
            backgroundPosition: 'top',
          }}
        >
          <div></div>
          <Link href='/products' className='button-85'>
            Shop all Chef Cella Products
          </Link>
        </div>
        <h2 className='text-2xl font-bold text-center mt-8'>
          The Chef Cella First Drop is Live
        </h2>
        <div className='w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mt-12'>
          <Suspense fallback={<CardsSkeleton />}>
            <CardWrapper />
          </Suspense>
        </div>
        <Suspense>
          <MailingListForm />
        </Suspense>
      </main>
    </div>
  );
}
