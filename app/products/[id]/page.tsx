import { fetchProductById } from '@/app/lib/data';
import { notFound } from 'next/navigation';
import ProductDetails from '@/app/components/productDetails/ProductDetails';
import ProductImages from '@/app/components/productDetails/components/ProductImages';
import { Suspense } from 'react';

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = params.id;

  const product = await fetchProductById(id);

  if (!product) {
    notFound();
  }

  return (
    <main className='w-full flex flex-row items-start mt-8'>
      <div className='w-1/2 flex items-center justify-center'>
        <Suspense>
          <ProductImages product={product} />
        </Suspense>
      </div>
      <div className='w-1/2 px-8'>
        <Suspense>
          <ProductDetails product={product} />
        </Suspense>
      </div>
    </main>
  );
}
