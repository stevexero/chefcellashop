'use client';

import SizeSelector from './SizeSelector';

interface Size {
  size_id: string;
  size: string;
}

interface ProductSize {
  size_id: string;
  price_mod: number;
  size: Size;
}

interface ProductSizesProps {
  sizes: ProductSize[];
  basePrice: number;
}

export default function ProductSizes({ sizes, basePrice }: ProductSizesProps) {
  return (
    <>
      {sizes?.[0].size_id === '00000000-0000-0000-0000-000000000001' ? (
        <p className='mt-4 text-xs md:text-base'>One Size</p>
      ) : (
        <SizeSelector sizes={sizes} basePrice={basePrice} />
      )}
    </>
  );
}
