'use client';

import { BiMinus, BiPlus } from 'react-icons/bi';
import { useProductsStore } from '../../store';
import { useEffect } from 'react';

const QuantitySelector = () => {
  const { quantity, setQuantity } = useProductsStore();

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    } else {
      setQuantity(1);
    }
  };

  const handleIncrement = () => {
    setQuantity(quantity + 1);
  };

  useEffect(() => {
    // Initialize to 1
    if (quantity > 1) {
      setQuantity(1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className='mt-6 flex flex-row items-center justify-end md:justify-start'>
      <p className='font-bold mr-4 text-xs md:text-base'>Quantity:</p>
      <div className='flex flex-row items-center border-2 border-slate-700'>
        <button
          className='cursor-pointer bg-slate-700 text-white p-2 text-xs md:text-base'
          onClick={handleDecrement}
        >
          <BiMinus />
        </button>
        <div className='px-4'>{quantity}</div>
        <button
          className='cursor-pointer bg-slate-700 text-white p-2 text-xs md:text-base'
          onClick={handleIncrement}
        >
          <BiPlus />
        </button>
      </div>
    </div>
  );
};

export default QuantitySelector;
