'use client';

import ColorSelector from './ColorSelector';

interface Product {
  product_id: string;
  product_images: { image_url: string; color_id: string }[];
  product_colors: {
    color: { color_id: string; color_name: string; color_hex_code: string };
  }[];
}

interface ProductColorsProps {
  product: Product;
}

export default function ProductColors({ product }: ProductColorsProps) {
  return (
    <>
      {product?.product_colors?.length > 0 ? (
        <ColorSelector product={product} />
      ) : (
        <p className='mt-4 text-xs md:text-base'>
          <span className='font-bold'>COLOR:</span> N/A
        </p>
      )}
    </>
  );
}
