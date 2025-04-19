'use client';

import { useState, useEffect } from 'react';
import { useAddProductStore } from '@/app/dashboard/components/addProduct/addProductStore';

export default function ProductBasePrice() {
  const { productBasePrice, setProductBasePrice } = useAddProductStore();

  const [inputValue, setInputValue] = useState<string>(
    productBasePrice.toFixed(2)
  );

  const handleFocus = () => {
    setInputValue('');
  };

  const handleBlur = () => {
    const parsed = parseFloat(inputValue);
    const finalValue = isNaN(parsed) ? 0 : parsed;
    setProductBasePrice(finalValue);
    setInputValue(finalValue.toFixed(2));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  useEffect(() => {
    setInputValue(productBasePrice.toFixed(2));
  }, [productBasePrice]);

  return (
    <div className='flex flex-col mt-4'>
      <label className='text-sm font-bold' htmlFor='price'>
        Base Price
      </label>
      <input
        className='border rounded p-2 text-right'
        id='price'
        type='text'
        value={inputValue}
        onFocus={handleFocus}
        onChange={handleChange}
        onBlur={handleBlur}
      />
    </div>
  );
}
