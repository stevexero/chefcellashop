'use client';

import { useCallback, useEffect, useState } from 'react';
import { useClientStore } from '@/app/store/clientStore';
import { FaTimes } from 'react-icons/fa';
import Link from 'next/link';
import CartModalItem from './CartModalItem';
import { useStore } from '../store';

const CartModal = () => {
  const { activeModal, toggleModal } = useClientStore();
  const { cartItems, setCartItems, itemQuantities } = useStore();

  const [loading, setLoading] = useState(false);

  const isOpen = activeModal === 'cart';

  const fetchCartItems = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/get-cart', {
        method: 'GET',
      });
      if (!response.ok) {
        throw new Error('Failed to fetch cart items');
      }
      const { items } = await response.json();
      setCartItems(items);
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setLoading(false);
    }
  }, [setCartItems]);

  // const calculateTotal = () => {
  //   return cartItems
  //     .reduce((total, item) => total + item.price * item.quantity, 0)
  //     .toFixed(2);
  // };

  const calculateTotal = () => {
    return cartItems
      .reduce((total, item) => {
        const quantity = itemQuantities[item.cart_item_id] || item.quantity;
        return total + item.price * quantity;
      }, 0)
      .toFixed(2);
  };

  const removeItemFromCart = async (cart_item_id: string) => {
    const formData = new FormData();
    formData.append('cart_item_id', cart_item_id);
    const response = await fetch('/api/delete-from-cart', {
      method: 'DELETE',
      body: formData,
    });
    const data = await response.json();
    console.log(data);
    fetchCartItems();
  };

  const updateItemQuantity = async (cart_item_id: string, quantity: number) => {
    const formData = new FormData();
    formData.append('cart_item_id', cart_item_id);
    formData.append('quantity', quantity.toString());
    const response = await fetch('/api/update-cart-quantity', {
      method: 'PUT',
      body: formData,
    });
    const data = await response.json();
    console.log(data);
    fetchCartItems();
  };

  useEffect(() => {
    console.log('fetchCartItems');
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      fetchCartItems();
    } else {
      document.body.style.overflow = '';
    }
  }, [isOpen, fetchCartItems]);

  return (
    <>
      {isOpen && (
        <div
          className='fixed inset-0 bg-black opacity-75 z-40'
          onClick={() => toggleModal('cart')}
        />
      )}

      <div
        className={`
          fixed top-0 right-0 h-screen w-80 bg-white shadow-lg z-50
          transform transition-transform duration-300
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}
        `}
      >
        <div className='p-4 flex flex-col md:h-full'>
          <div className='flex justify-between items-center mb-4'>
            <p className='text-lg font-bold'>Shopping Cart</p>
            <button
              onClick={() => toggleModal('cart')}
              className='text-gray-600 hover:text-gray-900 cursor-pointer'
            >
              <FaTimes />
            </button>
          </div>

          {loading ? (
            <p>Loading...</p>
          ) : cartItems.length === 0 ? (
            <p>Your cart is empty</p>
          ) : (
            <div className='flex-1 overflow-y-auto'>
              {cartItems.map((item) => (
                <CartModalItem
                  key={item.cart_item_id}
                  item={item}
                  updateItemQuantity={updateItemQuantity}
                  removeItemFromCart={removeItemFromCart}
                />
              ))}
              <div className='mt-4'>
                <p className='font-bold'>Total: ${calculateTotal()}</p>
              </div>
            </div>
          )}

          <div className='mt-4'>
            <Link href='/cart' passHref>
              {cartItems.length > 0 && (
                <button
                  className='w-full bg-slate-400 text-white p-2 rounded hover:bg-slate-800 cursor-pointer'
                  onClick={() => toggleModal('cart')}
                >
                  View Cart
                </button>
              )}
            </Link>
            <Link href='/checkout' passHref>
              <button
                className='w-full bg-black text-white p-2 rounded hover:bg-gray-800 cursor-pointer mt-2'
                disabled={cartItems.length === 0 || loading}
                onClick={() => toggleModal('cart')}
              >
                Checkout
              </button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default CartModal;
