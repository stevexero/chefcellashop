'use client';

import Image from 'next/image';
import { useState } from 'react';
import { BiMinus, BiPlus, BiTrash } from 'react-icons/bi';
import { useStore } from '../store';

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
  const { itemQuantities, setItemQuantity } = useStore();
  const [isEditingQuantity, setIsEditingQuantity] = useState(false);
  const quantity = itemQuantities[item.cart_item_id] || item.quantity;

  const selectedImage =
    item.products[0]?.product_images[0]?.image_url || '/NIA.jpg';

  const handleDecrement = () => {
    if (quantity > 1) {
      setItemQuantity(item.cart_item_id, quantity - 1);
      setIsEditingQuantity(true);
    } else {
      setItemQuantity(item.cart_item_id, 1);
    }
  };

  const handleIncrement = () => {
    setItemQuantity(item.cart_item_id, quantity + 1);
    setIsEditingQuantity(true);
  };

  const handleUpdateQuantity = () => {
    updateItemQuantity(item.cart_item_id, quantity);
    setIsEditingQuantity(false);
  };

  return (
    <div className='border-b py-2 flex flex-row items-start'>
      <div className='pr-2 md:pr-4'>
        <Image
          src={selectedImage}
          width={200}
          height={200}
          alt={item.products[0]?.product_name || 'Unknown Product'}
          className='max-w-[100px] md:max-w-[300px] max-h-[100px] md:max-h-[300px] object-contain'
        />
      </div>
      <div className='w-1/2 md:w-full flex flex-col mt-8'>
        <p className='font-bold text-sm md:text-xl'>
          {item.products[0]?.product_name.replaceAll('-', ' ').toUpperCase() ||
            'Unknown Product'}
        </p>
        <div className='w-full flex flex-col md:flex-row items-start md:items-center justify-between mt-4'>
          <div className='font-semibold mt-2'>
            <div className='md:w-72 text-xs md:text-base grid grid-cols-1 md:grid-cols-3 gap-2'>
              <p>{item.sizes?.[0]?.size || 'N/A'}</p>
              <p>{item.colors?.[0]?.color_name || 'N/A'}</p>
              <p>${item.price.toFixed(2)}</p>
            </div>
          </div>
          <div className='flex flex-row items-center gap-2'>
            <div className='text-xs md:text-base flex flex-row items-center border border-slate-700'>
              <button
                className='cursor-pointer bg-slate-700 text-white p-2'
                onClick={handleDecrement}
              >
                <BiMinus />
              </button>
              <div className='px-4'>{quantity}</div>
              <button
                className='cursor-pointer bg-slate-700 text-white p-2'
                onClick={handleIncrement}
              >
                <BiPlus />
              </button>
            </div>
            {isEditingQuantity && (
              <button
                className='text-blue-500 hover:text-blue-600 cursor-pointer'
                onClick={handleUpdateQuantity}
              >
                Update
              </button>
            )}
          </div>
          <div className='mt-4 md:mt-0 flex flex-row md:flex-col items-center md:items-end gap-2'>
            <p className='font-bold text-sm md:text-xl'>
              ${(item.price * item.quantity).toFixed(2)}
            </p>
            <button
              className='ml-4 text-red-500 hover:text-red-700 cursor-pointer'
              onClick={() => removeItemFromCart(item.cart_item_id)}
            >
              <BiTrash size={24} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
