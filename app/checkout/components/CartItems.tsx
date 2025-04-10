import React from 'react';
import { CartItem } from '@/app/types/types';
import Image from 'next/image';

export default function CartItems({ item }: { item: CartItem }) {
  //   const selectedImage =
  //     item.products?.[0]?.product_images?.[0]?.image_url || '/NIA.jpg';

  const selectedImage =
    item?.products?.[0]?.product_images.find(
      (image) => image.color_id === item.color_id
    )?.image_url ||
    item?.products?.[0]?.product_images[0]?.image_url ||
    '/NIA.jpg';

  return (
    <div
      key={item.cart_item_id}
      className='border-b py-2 flex flex-row items-center'
    >
      <div className='pr-2 md:pr-4'>
        <Image
          src={selectedImage}
          width={100}
          height={100}
          alt={item.products?.[0]?.product_name || 'Unknown Product'}
          className='max-w-[100px] md:max-w-[300px] max-h-[100px] md:max-h-[300px] object-contain'
        />
      </div>
      <div>
        <p className='font-semibold text-sm md:text-xl'>
          {item.products?.[0]?.product_name
            ?.replaceAll('-', ' ')
            .toUpperCase() || 'Unknown'}
        </p>
        <div className='grid grid-cols-4 gap-2'>
          <p className='text-sm md:text-lg'>
            <span className='font-semibold'>Size:</span>{' '}
            {item.sizes?.[0]?.size || 'N/A'}
          </p>
          <p className='text-sm md:text-lg'>
            <span className='font-semibold'>Color:</span>{' '}
            {item.colors?.[0]?.color_name || 'N/A'}
          </p>
          <p className='text-sm md:text-lg'>
            <span className='font-semibold'>Quantity:</span>{' '}
            {item.quantity || 0}
          </p>
          <p className='text-sm md:text-lg'>
            <span className='font-semibold'>Price:</span> $
            {((item.price || 0) * (item.quantity || 0)).toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  );
}
