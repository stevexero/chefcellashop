'use client';

import { useEffect } from 'react';
import { useClientStore } from '@/app/store/clientStore';
import { User } from '@supabase/supabase-js';
import { FaTimes } from 'react-icons/fa';
import AddProductForm from './addProductForm/AddProductForm';

interface AddProductModalProps {
  user: User | null;
}

const AddProductModal = ({ user }: AddProductModalProps) => {
  const { activeModal, toggleModal } = useClientStore();

  const isOpen = activeModal === 'add-product-modal';

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [isOpen]);

  return (
    <>
      {isOpen && (
        <div
          className='fixed inset-0 bg-black opacity-75 z-40'
          onClick={() => toggleModal('add-product-modal')}
        />
      )}

      <div
        className={`
          fixed top-0 right-0 h-full overflow-y-scroll w-80 bg-white shadow-lg z-50
          transform transition-transform duration-300
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}
        `}
      >
        <div className='p-4'>
          <button
            onClick={() => toggleModal('add-product-modal')}
            className='mb-4 text-gray-600 hover:text-gray-900 cursor-pointer'
          >
            <FaTimes />
          </button>
        </div>

        <div className='p-4'>
          <AddProductForm user={user} />
        </div>
      </div>
    </>
  );
};

export default AddProductModal;
