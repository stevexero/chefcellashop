'use client';

import { useEffect, useState } from 'react';
import CartItem from './components/CartItem';
import Link from 'next/link';
import { BiArrowToLeft } from 'react-icons/bi';
import { useStore } from './store';

export default function CartDetails() {
  const [loading, setLoading] = useState(false);
  const { cartItems, setCartItems, itemQuantities, resetItemQuantities } =
    useStore();

  const fetchCartItems = async () => {
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
  };

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
    resetItemQuantities(); // Reset quantities after successful update
  };

  useEffect(() => {
    fetchCartItems();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className='p-8'>
      {loading ? (
        <p>Loading...</p>
      ) : cartItems.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <>
          <div className='flex-1 overflow-y-auto'>
            <div className='flex flex-row items-center justify-between pb-4 border-b border-b-slate-300'>
              <Link
                href='/products'
                className='flex flex-row items-center text-sm text-slate-500'
              >
                <BiArrowToLeft />
                &nbsp;Continue Shopping
              </Link>
              <h1 className='text-2xl font-bold text-center'>Cart</h1>
              <p className='text-sm text-slate-500'>
                {cartItems.length} items in cart
              </p>
            </div>
            {cartItems.map((item) => (
              <CartItem
                key={item.cart_item_id}
                item={item}
                removeItemFromCart={removeItemFromCart}
                updateItemQuantity={updateItemQuantity}
              />
            ))}
            <div className='mt-4'>
              <p className='font-bold text-right'>Total: ${calculateTotal()}</p>
            </div>
          </div>
          <Link
            href='/checkout'
            className='block w-full button-85 text-center mt-12'
          >
            Checkout
          </Link>
        </>
      )}
    </div>
  );
}
