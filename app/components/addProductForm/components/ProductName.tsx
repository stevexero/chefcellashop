'use client';

import { useStore } from '../store';

export default function ProductName() {
  const { productName, setProductName } = useStore();

  return (
    <div className='flex flex-col mt-4'>
      <label className='text-sm font-bold' htmlFor='product-name'>
        Product Name
      </label>
      <input
        className='border rounded p-2'
        id='product-name'
        // name='product-name'
        type='text'
        value={productName}
        onChange={(e) => setProductName(e.target.value)}
      />
    </div>
  );
}
