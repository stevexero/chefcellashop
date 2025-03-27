'use client';

import { useClientStore } from '../../../store/clientStore';

export default function QuickAddProductButton() {
  const { toggleModal } = useClientStore();

  return (
    <button
      className='px-6 py-4 bg-black text-white flex items-center justify-center rounded-xl hover:bg-slate-700 cursor-pointer'
      onClick={() => toggleModal('add-product-modal')}
    >
      Quick Add Product
    </button>
  );
}
