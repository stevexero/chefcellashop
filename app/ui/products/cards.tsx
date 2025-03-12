import { fetchProducts } from '@/app/lib/data';
import Link from 'next/link';

export default async function CardWrapper() {
  const products = await fetchProducts();

  return (
    <>
      {products?.map((product) => (
        <Card
          key={product.product_id}
          id={product.product_id}
          title={product.product_name}
          price={product.price}
        />
      ))}
    </>
  );
}

export function Card({
  id,
  title,
  price,
}: {
  id: string;
  title: string;
  price: number | string;
}) {
  return (
    <Link
      href={`products/${id}`}
      className='rounded-xl bg-gray-50 p-2 shadow-sm'
    >
      <div className='flex p-4'>
        <h3 className='ml-2 text-sm font-medium'>{title}</h3>
      </div>
      <p
        className={`
          truncate rounded-xl bg-white px-4 py-8 text-center text-2xl`}
      >
        ${price}
      </p>
    </Link>
  );
}
