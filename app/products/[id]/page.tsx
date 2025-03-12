import { fetchProductById } from '@/app/lib/data';
import { notFound } from 'next/navigation';

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = params.id;

  const product = await fetchProductById(id);

  console.log(product);

  if (!product) {
    notFound();
  }

  return (
    <main>
      <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-4'>
        Hi {product.product_id}
      </div>
      <p>{product.product_name}</p>
      <p>${product.price}</p>
      <p>{product.color}</p>
      <p>{product.description || ''}</p>
    </main>
  );
}
