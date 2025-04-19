'use client';

import { useAddProductStore } from '@/app/dashboard/components/addProduct/addProductStore';

export default function ProductName() {
  const { productName, setProductName } = useAddProductStore();

  return (
    <div className='flex flex-col mt-4'>
      <label className='text-sm font-bold' htmlFor='product-name'>
        Product Name
      </label>
      <input
        className='border rounded p-2'
        id='product-name'
        type='text'
        value={productName}
        onChange={(e) => setProductName(e.target.value)}
      />
    </div>
  );
}
