'use client';

import { useEffect } from 'react';
import { useProductsStore } from '../../store';

interface Size {
  size_id: string;
  size: string;
}

interface ProductSize {
  size_id: string;
  price_mod: number;
  size: Size;
}

interface SizeSelectorProps {
  sizes: ProductSize[];
  basePrice: number;
}

export default function SizeSelector({ sizes, basePrice }: SizeSelectorProps) {
  const {
    selectedSize,
    sizeName,
    setSelectedSize,
    setSizeName,
    setAdjustedPrice,
    initializeSize,
  } = useProductsStore();

  useEffect(() => {
    initializeSize(sizes, basePrice);
  }, [sizes, basePrice, initializeSize]);

  const handleSizeChange = (size: ProductSize) => {
    setSelectedSize(size.size_id);
    setSizeName(size.size.size);
    setAdjustedPrice(basePrice + size.price_mod);
  };

  return (
    <div className='border rounded-md md:border-none md:rounded-none p-2 mt-4 flex flex-row md:flex-col items-center md:items-start justify-between md:justify-start'>
      <div className='mt-0 md:mt-4 flex'>
        <span className='font-bold text-xs md:text-base'>Size:</span>
        {sizes?.length > 0 ? (
          <p className='ml-2 text-xs md:text-base'>
            {sizeName || 'Select a size'}
          </p>
        ) : (
          <p className='ml-2 text-xs md:text-base'>One Size</p>
        )}
      </div>
      <div className='mt-0 md:mt-2 inline-flex flex-row border-2 border-slate-700'>
        {sizes && sizes.length > 0
          ? sizes.map((productSize) => (
              <div
                key={productSize.size_id}
                className={`w-8 md:w-12 h-8 md:h-12 text-xs md:text-base flex items-center justify-center cursor-pointer hover:bg-slate-700 hover:text-white ${
                  selectedSize === productSize.size_id
                    ? 'bg-slate-700 text-white'
                    : ''
                }`}
                onClick={() => handleSizeChange(productSize)}
              >
                {productSize.size.size}
              </div>
            ))
          : null}
      </div>
    </div>
  );
}
