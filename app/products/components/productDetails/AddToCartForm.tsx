'use client';

import { useEffect, useState } from 'react';
import { useProductsStore } from '../../store';
import { useClientStore } from '@/app/store/clientStore';
import Cookies from 'js-cookie';
import { AddItemToCartProps } from '@/app/types/types';

export default function AddToCartForm({
  productId,
  isOneSize,
}: AddItemToCartProps) {
  const { quantity, selectedColorId, selectedSize, setSelectedSize } =
    useProductsStore();
  const { toggleModal, setCartItems } = useClientStore();

  const [isPending, setIsPending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsPending(true);

    const formData = new FormData();

    formData.append('productId', productId);
    formData.append('sizeId', selectedSize || '');
    formData.append('colorId', selectedColorId || '');
    formData.append('quantity', quantity.toString());

    try {
      const response = await fetch('/api/add-to-cart', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        console.log(response);
        throw new Error('Failed to add item to cart');
      }

      const result = await response.json();

      if (result.cartId) {
        Cookies.set('cartId', result.cartId);
      }

      const cartResponse = await fetch('/api/get-cart');
      const { items } = await cartResponse.json();

      setCartItems(items);
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setIsPending(false);
      toggleModal('cart');
    }
  };

  useEffect(() => {
    if (isOneSize) {
      setSelectedSize('');
    }
  }, [isOneSize, setSelectedSize]);

  return (
    <form onSubmit={handleSubmit}>
      <input type='hidden' name='productId' value={productId} />
      <input type='hidden' name='sizeId' value={selectedSize || ''} />
      <input type='hidden' name='colorId' value={selectedColorId || ''} />
      <input type='hidden' name='quantity' value={quantity.toString()} />
      <button type='submit' className='button-85 w-full' disabled={isPending}>
        {isPending ? 'Adding...' : 'Add to cart'}
      </button>
    </form>
  );
}
