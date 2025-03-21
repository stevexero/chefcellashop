'use client';

import { useEffect, useState } from 'react';
import { useStore } from '../store';
import { useClientStore } from '@/app/store/clientStore';

interface AddItemToCartProps {
  productId: string;
  isOneSize: boolean;
}

export default function AddToCartForm({
  productId,
  isOneSize,
}: AddItemToCartProps) {
  const { quantity, selectedColorId, selectedSize, setSelectedSize } =
    useStore();
  const { toggleModal } = useClientStore();

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
      // console.log(selectedSize);
      const response = await fetch('/api/add-to-cart', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        console.log(response);
        throw new Error('Failed to add item to cart');
      }

      // console.log('Added to cart:', {
      //   productId,
      //   selectedSize,
      //   selectedColorId,
      //   quantity,
      // });
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setIsPending(false);
      // setSelectedSize('');
      //   setSelectedColorId('');
      // setQuantity(1);
      toggleModal('cart');
    }
  };

  useEffect(() => {
    // Resets selectedSize to empty string if oneSize product
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
