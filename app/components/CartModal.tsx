'use client';

import { useEffect, useState } from 'react';
import { useClientStore } from '@/app/store/clientStore';
import { FaTimes } from 'react-icons/fa';

interface CartItem {
  cart_item_id: string;
  product_id: string;
  size_id: string | null;
  color_id: string | null;
  quantity: number;
  price: number;
  products: { product_name: string }[]; // Changed to array
  sizes: { size: string }[] | null; // Changed to array or null
  colors: { color_name: string }[] | null; // Changed to array or null
}

const CartModal = () => {
  const { activeModal, toggleModal } = useClientStore();
  const isOpen = activeModal === 'cart';
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      fetchCartItems();
    } else {
      document.body.style.overflow = '';
    }
  }, [isOpen]);

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
      .reduce((total, item) => total + item.price * item.quantity, 0)
      .toFixed(2);
  };

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
        <div className='p-4 flex flex-col h-full'>
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
                <div key={item.cart_item_id} className='border-b py-2'>
                  <p className='font-semibold'>
                    {item.products[0]?.product_name || 'Unknown Product'}
                  </p>
                  <p>Size: {item.sizes?.[0]?.size || 'N/A'}</p>
                  <p>Color: {item.colors?.[0]?.color_name || 'N/A'}</p>
                  <p>Quantity: {item.quantity}</p>
                  <p>Price: ${item.price.toFixed(2)}</p>
                  <p>Subtotal: ${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
              <div className='mt-4'>
                <p className='font-bold'>Total: ${calculateTotal()}</p>
              </div>
            </div>
          )}

          <div className='mt-4'>
            <button
              className='w-full bg-black text-white p-2 rounded hover:bg-gray-800'
              disabled={cartItems.length === 0 || loading}
            >
              Checkout
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CartModal;
