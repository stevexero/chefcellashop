import { fetchProducts } from '@/app/lib/data';
import Image from 'next/image';
import Link from 'next/link';

export default async function CardWrapper() {
  const products = await fetchProducts();

  return (
    <>
      {products?.map((product) => {
        const imageUrl =
          product.product_images && product.product_images.length > 0
            ? product.product_images[0].image_url
            : null;
        return (
          <Card
            key={product.product_id}
            id={product.product_id}
            imageUrl={imageUrl}
            title={product.product_name}
            price={product.price}
          />
        );
      })}
    </>
  );
}

export function Card({
  id,
  imageUrl,
  title,
  price,
}: {
  id: string;
  imageUrl?: string | null;
  title: string;
  price: number | string;
}) {
  return (
    <Link href={`products/${id}`} className='flex flex-col items-center'>
      {imageUrl ? (
        <Image src={imageUrl} width={300} height={300} alt={title} />
      ) : (
        <div className='w-[300px] h-[300px] flex items-center justify-center'>
          <span>No Image</span>
        </div>
      )}
      <div className='flex flex-col mt-8'>
        <h3 className='text-center'>{title.toUpperCase()}</h3>
        <p className='text-center'>${price}</p>
      </div>
    </Link>
  );
}
