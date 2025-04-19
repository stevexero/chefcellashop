import { fetchProducts } from '@/app/lib/data/products';
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
            price={product.base_price}
            colors={product.product_colors}
            sizes={product.product_sizes}
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
  colors,
  sizes,
}: {
  id: string;
  imageUrl?: string | null;
  title: string;
  price: number | string;
  colors?: {
    color: { color_id: string; color_name: string; color_hex_code: string };
  }[];
  sizes?: {
    size: { size_id: string };
  }[];
}) {
  const uniqueColors = colors?.map((pc) => pc.color) || [];
  const colorCount = uniqueColors.length;

  const uniqueSizes = sizes?.map((ps) => ps.size) || [];
  const sizesCount = uniqueSizes.length;

  return (
    <Link href={`products/${id}`} className='flex flex-col items-center mb-8'>
      {imageUrl ? (
        <Image
          src={imageUrl}
          width={300}
          height={300}
          alt={title}
          className='w-xs h-xs max-w-[320px] max-h-[320px] object-contain'
        />
      ) : (
        <div className='w-xs h-xs flex items-center justify-center'>
          <span>No Image</span>
        </div>
      )}
      <div className='flex flex-col mt-8'>
        <h3 className='text-center'>
          {title.replaceAll('-', ' ').toUpperCase()}
        </h3>
        <p className='text-center'>${price}</p>

        <p className='text-center text-sm'>
          {sizesCount === 0 ? (
            'One Size'
          ) : (
            <>
              {sizesCount} {sizesCount === 1 ? 'Size' : 'Sizes'} Available
            </>
          )}
        </p>

        <p className='text-center text-sm'>
          {colorCount} {colorCount === 1 ? 'Color' : 'Colors'} Available
        </p>
        {colorCount > 0 && (
          <div className='flex justify-center gap-2 mt-2'>
            {uniqueColors.map((color) => (
              <div
                key={color.color_id}
                className='w-6 h-6 rounded-full border'
                style={{ backgroundColor: color.color_hex_code }}
                title={color.color_name}
              />
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}
