'use client';

import { useEffect } from 'react';
import { useStore } from '../store';

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
  } = useStore();

  useEffect(() => {
    initializeSize(sizes, basePrice);
  }, [sizes, basePrice, initializeSize]);

  const handleSizeChange = (size: ProductSize) => {
    setSelectedSize(size.size_id);
    setSizeName(size.size.size);
    setAdjustedPrice(basePrice + size.price_mod);
  };

  return (
    <>
      <div className='mt-4 flex'>
        <span className='font-bold'>Size:</span>
        {sizes?.length > 0 ? (
          <p className='ml-2'>{sizeName || 'Select a size'}</p>
        ) : (
          <p className='ml-2'>One Size</p>
        )}
      </div>
      <div className='mt-2 inline-flex flex-row border-2 border-slate-700'>
        {sizes && sizes.length > 0
          ? sizes.map((productSize) => (
              <div
                key={productSize.size_id}
                className={`w-12 h-12 flex items-center justify-center cursor-pointer hover:bg-slate-700 hover:text-white ${
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
    </>
  );
}
