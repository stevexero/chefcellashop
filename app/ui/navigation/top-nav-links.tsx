'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { CiUser, CiShoppingCart } from 'react-icons/ci';
import { useClientStore } from '@/app/store/clientStore';
import { usePathname } from 'next/navigation';

const TopNavLinks = () => {
  const { toggleModal, cartItems, setCartItems } = useClientStore();
  const [isLoading, setIsLoading] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    // Clear cart items if we're on the payment success page
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
      <Link href='/products' className='button-85 mr-16'>
        Shop
      </Link>
      <CiUser
        size='1.5rem'
        className='cursor-pointer'
        onClick={() => toggleModal('user')}
      />
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
