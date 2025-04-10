'use client';

import Image from 'next/image';

interface OrderItemProps {
  item: {
    products: {
      product_images: { image_url: string; color_id: string }[];
      product_name: string;
    };
    sizes: { size: string } | null;
    colors: { color_name: string; color_id: string } | null;
    quantity: number;
    price: number;
  };
}

export default function OrderItem({ item }: OrderItemProps) {
  return (
    <div className='flex items-center gap-4 p-4 rounded-lg'>
      <div className='relative w-20 h-20'>
        <Image
          src={
            item?.products?.product_images.find(
              (image) => image.color_id === item.colors?.color_id
            )?.image_url ||
            item?.products?.product_images[0]?.image_url ||
            '/NIA.jpg'
          }
          alt={item.products.product_name}
          fill
          sizes='80px'
          className='object-contain'
        />
      </div>
      <div className='flex-1'>
        <h4 className='font-bold'>
          {item.products.product_name.replaceAll('-', ' ').toUpperCase()}
        </h4>
        <div className='flex flex-row gap-4 text-sm font-semibold text-black'>
          <p>Size: {item.sizes?.size || 'N/A'}</p>
          <p>Color: {item.colors?.color_name || 'N/A'}</p>
          <p>Quantity: {item.quantity}</p>
          <p>${(item.price * item.quantity).toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
}
