'use client';

import { useTransition } from 'react';
import { addItemToCart } from '@/app/lib/actions';
import { useClientStore } from '../store/clientStore';

interface AddItemToCartProps {
  productId: string;
}

export default function AddToCartForm({ productId }: AddItemToCartProps) {
  const { selectedSize, quantity } = useClientStore();
  const [isPending, startTransition] = useTransition();

  return (
    <form
      action={async (formData: FormData) => {
        startTransition(() => addItemToCart(formData));
      }}
    >
      <input type='hidden' name='productId' value={productId} />
      <input type='hidden' name='size' value={selectedSize} />
      <input type='hidden' name='quantity' value={quantity.toString()} />

      <button type='submit' className='button-85 w-full' disabled={isPending}>
        {isPending ? 'Adding...' : 'Add to cart'}
      </button>
    </form>
  );
}
