'use client';

import Image from 'next/image';
import { useState } from 'react';
import { BiMinus, BiPlus, BiTrash } from 'react-icons/bi';

interface ProductImage {
  image_url: string;
}

interface CartItem {
  cart_item_id: string;
  product_id: string;
  size_id: string | null;
  color_id: string | null;
  quantity: number;
  price: number;
  products: { product_name: string; product_images: ProductImage[] }[];
  sizes: { size: string }[] | null;
  colors: { color_name: string }[] | null;
}

interface CartModalItemProps {
  item: CartItem;
  removeItemFromCart: (cart_item_id: string) => void;
  updateItemQuantity: (cart_item_id: string, quantity: number) => void;
}

export default function CartModalItem({
  item,
  removeItemFromCart,
  updateItemQuantity,
}: CartModalItemProps) {
  const [quantity, setQuantity] = useState(item.quantity);
  const [isEditingQuantity, setIsEditingQuantity] = useState(false);

  const selectedImage =
    item.products[0]?.product_images[0]?.image_url || '/NIA.jpg';

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
      setIsEditingQuantity(true);
    } else {
      setQuantity(1);
    }
  };

  const handleIncrement = () => {
    setQuantity(quantity + 1);
    setIsEditingQuantity(true);
  };

  const handleUpdateQuantity = () => {
    updateItemQuantity(item.cart_item_id, quantity);
    setIsEditingQuantity(false);
  };

  return (
    <div className='border-b py-2 flex flex-row items-center'>
      <div className='pr-4'>
        <Image
          src={selectedImage}
          width={100}
          height={100}
          alt={item.products[0]?.product_name || 'Unknown Product'}
          className='max-w-[200px] max-h-[200px] object-contain'
        />
      </div>
      <div className='w-full flex flex-col'>
        <div className='flex flex-row items-center justify-between'>
          <p className='font-bold'>
            {item.products[0]?.product_name
              .replaceAll('-', ' ')
              .toUpperCase() || 'Unknown Product'}
          </p>
          <button
            className='ml-4 text-red-500 hover:text-red-700 cursor-pointer'
            onClick={() => removeItemFromCart(item.cart_item_id)}
          >
            <BiTrash size={18} />
          </button>
        </div>
        <div className='w-full flex flex-row items-center justify-between'>
          <div className='text-xs font-semibold mt-2'>
            <p>{item.sizes?.[0]?.size || 'N/A'}</p>
            <p>{item.colors?.[0]?.color_name || 'N/A'}</p>
            <p>${item.price.toFixed(2)} each</p>
            <p>
              x{quantity} = ${(item.price * item.quantity).toFixed(2)}
            </p>
          </div>
          <div>
            <div className='flex flex-row items-center border border-slate-700'>
              <button
                className='cursor-pointer bg-slate-700 text-white p-1'
                onClick={handleDecrement}
              >
                <BiMinus />
              </button>
              <div className='px-2 text-xs'>{quantity}</div>
              <button
                className='cursor-pointer bg-slate-700 text-white p-1'
                onClick={handleIncrement}
              >
                <BiPlus />
              </button>
            </div>
            {isEditingQuantity ? (
              <button
                className='text-blue-500 hover:text-blue-600 cursor-pointer text-xs underline'
                onClick={handleUpdateQuantity}
              >
                Update
              </button>
            ) : (
              <div></div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
