'use client';

import { useState } from 'react';
import { useAddProductStore } from '@/app/dashboard/components/addProduct/addProductStore';

export default function ProductDescription() {
  const { productDescription, setProductDescription } = useAddProductStore();

  const [showDescription, setShowDescription] = useState(false);

  const handleAddDescriptionClick = () => {
    setShowDescription((prev) => !prev);
  };

  return (
    <div className='flex flex-col mt-4'>
      <label className='text-sm font-bold' htmlFor='product-description'>
        Description
      </label>
      {showDescription ? (
        <>
          <label className='text-sm font-bold' htmlFor='product-description'>
            Product Description
          </label>
          <textarea
            className='border rounded p-2 h-32 overflow-y-scroll resize-none'
            id='product-description'
            value={productDescription}
            onChange={(e) => setProductDescription(e.target.value)}
          />
          <button
            className='w-full bg-red-600 text-white text-sm p-2 rounded cursor-pointer hover:bg-red-400 mt-2'
            onClick={handleAddDescriptionClick}
          >
            Cancel
          </button>
        </>
      ) : (
        <>
          <button
            className='w-full bg-white border text-slate-700 font-bold text-sm p-2 rounded cursor-pointer hover:bg-slate-200 disabled:bg-slate-200'
            onClick={handleAddDescriptionClick}
          >
            Add Description
          </button>
        </>
      )}
    </div>
  );
}
