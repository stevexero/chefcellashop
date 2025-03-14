'use client';

import { BiMinus, BiPlus } from 'react-icons/bi';
import { useClientStore } from '../store/clientStore';

const QuantitySelector = () => {
  const { quantity, setQuantity } = useClientStore();

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

  return (
    <div className='flex flex-row items-center border-2 border-slate-700'>
      <button
        className='cursor-pointer bg-slate-700 text-white p-2'
        onClick={handleDecrement}
      >
        <BiMinus />
      </button>
      <div className='px-4'>{quantity}</div>
      <button
        className='cursor-pointer bg-slate-700 text-white p-2'
        onClick={handleIncrement}
      >
        <BiPlus />
      </button>
    </div>
  );
};

export default QuantitySelector;
