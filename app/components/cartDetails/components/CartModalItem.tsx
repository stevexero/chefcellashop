'use client';

import Image from 'next/image';
import { useState } from 'react';
import { BiMinus, BiPlus, BiTrash } from 'react-icons/bi';
import { CartItem } from '@/app/types/types';
import { useRouter } from 'next/navigation';

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
  const router = useRouter();
  const selectedImage =
    item?.products?.[0]?.product_images.find(
      (image) => image.color_id === item.color_id
    )?.image_url ||
    item?.products?.[0]?.product_images[0]?.image_url ||
    '/NIA.jpg';

  const handleDecrement = () => {
    if (quantity && quantity > 1) {
      setQuantity(quantity - 1);
      setIsEditingQuantity(true);
    } else {
      setQuantity(1);
    }
  };

  const handleIncrement = () => {
    setQuantity((quantity || 0) + 1);
    setIsEditingQuantity(true);
  };

  const handleUpdateQuantity = () => {
    updateItemQuantity(item?.cart_item_id || '', quantity || 0);
    setIsEditingQuantity(false);
    router.refresh();
  };

  return (
    <div className='border-b py-2 flex flex-row items-center'>
      <div className='pr-4'>
        <Image
          src={selectedImage}
          width={100}
          height={100}
          alt={item.products?.[0]?.product_name || 'Unknown Product'}
          className='max-w-[200px] max-h-[200px] object-contain'
        />
      </div>
      <div className='w-full flex flex-col'>
        <div className='flex flex-row items-center justify-between'>
          <p className='font-bold'>
            {item?.products?.[0]?.product_name
              .replaceAll('-', ' ')
              .toUpperCase() || 'Unknown Product'}
          </p>
          <button
            className='ml-4 text-red-500 hover:text-red-700 cursor-pointer'
            onClick={() => {
              removeItemFromCart(item?.cart_item_id || '');
              router.refresh();
            }}
          >
            <BiTrash size={18} />
          </button>
        </div>
        <div className='w-full flex flex-row items-center justify-between'>
          <div className='text-xs font-semibold'>
            {item.old_price && item.coupon_id ? (
              <p>
                <span className='font-semibold'>Price:</span>&nbsp;
                <span className='line-through text-red-500'>
                  ${item.old_price.toFixed(2)}
                </span>
                <span className='text-black font-bold'>
                  ${item.price!.toFixed(2)}
                </span>
              </p>
            ) : (
              <p>
                <span className='font-semibold'>Price:</span> $
                {((item.price || 0) * (item.quantity || 0)).toFixed(2)}
              </p>
            )}
            <p className='mt-2'>{item.sizes?.[0]?.size || 'N/A'}</p>
            <p>{item.colors?.[0]?.color_name || 'N/A'}</p>
            {/* <p>${item.price?.toFixed(2) || 'N/A'} each</p> */}

            <p className='mt-4'>
              x{quantity} =&nbsp;
              {item.old_price && item.coupon_id ? (
                <>
                  <span className='line-through text-red-500'>
                    $
                    {((item.old_price || 0) * (item?.quantity || 0)).toFixed(2)}
                  </span>
                  <span className='text-black font-bold'>
                    ${((item.price || 0) * (item?.quantity || 0)).toFixed(2)}
                  </span>
                </>
              ) : (
                ((item?.price || 0) * (item?.quantity || 0)).toFixed(2)
              )}
            </p>
          </div>
          <div>
            <div className='flex flex-row items-center border border-slate-700 mt-2 -ml-4'>
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
