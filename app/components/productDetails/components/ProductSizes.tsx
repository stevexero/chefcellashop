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
      {sizes?.length > 0 ? (
        <SizeSelector sizes={sizes} basePrice={basePrice} />
      ) : (
        <p className='mt-4'>One Size</p>
      )}
    </>
  );
}
