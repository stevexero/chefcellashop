'use client';

import { useEffect, useState } from 'react';
// import Link from 'next/link';
import { CiShoppingCart } from 'react-icons/ci';
import { useClientStore } from '@/app/store/clientStore';
import { usePathname } from 'next/navigation';

const TopNavLinks = () => {
  const { toggleModal, cartItems, setCartItems } = useClientStore();
  const [isLoading, setIsLoading] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    if (pathname === '/payment-success') {
      setCartItems([]);
      return;
    }

    const fetchCartItems = async () => {
      try {
        const res = await fetch('/api/get-cart');
        const data = await res.json();
        setCartItems(data.items || []);
      } catch (error) {
        console.error('Error fetching cart:', error);
        setCartItems([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCartItems();
  }, [setCartItems, pathname]);

  return (
    <div className='text-white flex flex-row items-center'>
      {/* <Link href='/products' className='hidden md:block button-85 mr-16'>
        Shop
      </Link> */}
      <div
        className='flex flex-row items-center cursor-pointer'
        onClick={() => toggleModal('cart')}
      >
        <CiShoppingCart size='1.5rem' className='ml-4' />
        {!isLoading && (
          <div className='text-white text-xs ml-2'>({cartItems.length})</div>
        )}
      </div>
    </div>
  );
};

export default TopNavLinks;
