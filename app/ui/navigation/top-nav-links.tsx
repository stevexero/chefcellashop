'use client';

import { CiUser, CiShoppingCart } from 'react-icons/ci';
import { useClientStore } from '@/app/store/clientStore';

const TopNavLinks = () => {
  const { toggleModal } = useClientStore();

  return (
    <div className='text-white flex flex-row items-center'>
      <CiUser
        size='1.5rem'
        className=' cursor-pointer'
        onClick={() => toggleModal('user')}
      />
      <CiShoppingCart
        size='1.5rem'
        className='ml-4 cursor-pointer'
        onClick={() => toggleModal('cart')}
      />
    </div>
  );
};

export default TopNavLinks;
