'use client';

// import { useTransition } from 'react';
// import { addItemToCart } from '@/app/lib/actions';
import { useClientStore } from '../../../store/clientStore';
import { useStore } from '../store';

interface AddItemToCartProps {
  productId: string;
  selectedColorId: string | null;
}

export default function AddToCartForm({
  productId,
  selectedColorId,
}: AddItemToCartProps) {
  const { selectedSize } = useClientStore();
  const { quantity } = useStore();
  // const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Adding to cart:', { productId, selectedColorId });
    // Your add-to-cart logic here
  };

  return (
    <form
      // action={async (formData: FormData) => {
      //   startTransition(() => addItemToCart(formData));
      // }}
      onSubmit={handleSubmit}
    >
      <input type='hidden' name='productId' value={productId} />
      <input type='hidden' name='size' value={selectedSize} />
      <input type='hidden' name='quantity' value={quantity.toString()} />

      {/* <button type='submit' className='button-85 w-full' disabled={isPending}> */}
      <button type='submit' className='button-85 w-full'>
        {/* {isPending ? 'Adding...' : 'Add to cart'} */}
        Add to cart
      </button>
    </form>
  );
}
