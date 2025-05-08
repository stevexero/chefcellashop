'use client';

import Image from 'next/image';
import { useState } from 'react';
import { BiMinus, BiPlus, BiTrash } from 'react-icons/bi';
import { useStore } from '../store';
import type { CartItem } from '@/app/types/types';

interface CartModalItemProps {
  item: CartItem;
  removeItemFromCart: (cart_item_id: string) => void;
  updateItemQuantity: (cart_item_id: string, quantity: number) => void;
}

export default function CartItem({
  item,
  removeItemFromCart,
  updateItemQuantity,
}: CartModalItemProps) {
  const { itemQuantities, setItemQuantity } = useStore();
  const [isEditingQuantity, setIsEditingQuantity] = useState(false);
  const quantity = itemQuantities[item?.cart_item_id || ''] || item?.quantity;

  const selectedImage =
    item?.products?.[0]?.product_images.find(
      (image) => image.color_id === item.color_id
    )?.image_url ||
    item?.products?.[0]?.product_images[0]?.image_url ||
    '/NIA.jpg';

  const handleDecrement = () => {
    if (quantity && quantity > 1) {
      setItemQuantity(item?.cart_item_id || '', quantity - 1);
      setIsEditingQuantity(true);
    } else {
      setItemQuantity(item?.cart_item_id || '', 1);
    }
  };

  const handleIncrement = () => {
    setItemQuantity(item?.cart_item_id || '', (quantity || 0) + 1);
    setIsEditingQuantity(true);
  };

  const handleUpdateQuantity = () => {
    updateItemQuantity(item?.cart_item_id || '', quantity || 0);
    setIsEditingQuantity(false);
  };

  return (
    <div className='border-b py-2 flex flex-row items-start'>
      <div className='pr-2 md:pr-4'>
        <Image
          src={selectedImage}
          width={200}
          height={200}
          alt={item?.products?.[0]?.product_name || 'Unknown Product'}
          className='max-w-[100px] md:max-w-[300px] max-h-[100px] md:max-h-[300px] object-contain'
        />
      </div>
      <div className='w-1/2 md:w-full flex flex-col mt-8'>
        <p className='font-bold text-sm md:text-xl'>
          {item?.products?.[0]?.product_name
            .replaceAll('-', ' ')
            .toUpperCase() || 'Unknown Product'}
        </p>
        <div className='w-full flex flex-col md:flex-row items-start md:items-center justify-between mt-4'>
          <div className='font-semibold mt-2'>
            <div className='md:w-72 text-xs md:text-base grid grid-cols-1 md:grid-cols-3 gap-2'>
              <p>{item.sizes?.[0]?.size || 'N/A'}</p>
              <p>{item.colors?.[0]?.color_name || 'N/A'}</p>
              {/* <p>${item.price?.toFixed(2) || 'N/A'}</p> */}
              {item.old_price && item.coupon_id ? (
                <p className='text-sm md:text-lg'>
                  <span className='font-semibold'>Price:</span>&nbsp;
                  <span className='line-through text-red-500'>
                    ${item.old_price.toFixed(2)}
                  </span>
                  <span className='text-green-500 font-bold'>
                    ${item.price!.toFixed(2)}
                  </span>
                </p>
              ) : (
                <p className='text-sm md:text-lg'>
                  <span className='font-semibold'>Price:</span> $
                  {((item.price || 0) * (item.quantity || 0)).toFixed(2)}
                </p>
              )}
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
            {item.old_price && item.coupon_id ? (
              <p className='text-sm md:text-lg'>
                <span className='font-semibold'>Price:</span>&nbsp;
                <span className='line-through text-red-500'>
                  ${((item.old_price || 0) * (item.quantity || 0)).toFixed(2)}
                </span>
                <span className='text-green-500 font-bold'>
                  ${((item.price || 0) * (item.quantity || 0)).toFixed(2)}
                </span>
              </p>
            ) : (
              <p className='text-sm md:text-lg'>
                <span className='font-semibold'>Price:</span> $
                {((item.price || 0) * (item.quantity || 0)).toFixed(2)}
              </p>
            )}
            {/* <p className='font-bold text-sm md:text-xl'>
              ${(item?.price || 0) * (item?.quantity || 0)}
            </p> */}
            <button
              className='ml-4 text-red-500 hover:text-red-700 cursor-pointer'
              onClick={() => removeItemFromCart(item?.cart_item_id || '')}
            >
              <BiTrash size={24} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
