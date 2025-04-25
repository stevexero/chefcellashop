'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import { useProductsStore } from '../../store';
import { ProductProps } from '@/app/types/types';

export default function ProductImages({ product }: ProductProps) {
  const { selectedImage, setSelectedImage, selectedColorId } =
    useProductsStore();

  const handleThumbnailClick = (imageUrl: string) => {
    setSelectedImage(imageUrl);
  };

  useEffect(() => {
    setSelectedImage(
      product.product_images.find((image) => image.color_id === selectedColorId)
        ?.image_url ||
        product.product_images[0]?.image_url ||
        ''
    );
  }, [product?.product_images, setSelectedImage, selectedColorId]);

  return (
    <div className='flex flex-col items-center'>
      {selectedImage ? (
        <Image
          src={selectedImage}
          width={700}
          height={700}
          alt={product.product_name}
          className='max-w-[300px] md:max-w-[600px] max-h-[300px] md:max-h-[600px] object-contain'
        />
      ) : (
        <div className='max-w-[300px] md:max-w-[600px] max-h-[300px] md:max-h-[600px] bg-gray-200 flex items-center justify-center'>
          <span>No Image</span>
        </div>
      )}

      {product.product_images && product.product_images.length > 1 && (
        <div className='flex gap-2 mt-4 flex-wrap justify-center'>
          {product.product_images.map((img, index) => (
            <button
              key={index}
              type='button'
              onClick={() => handleThumbnailClick(img.image_url)}
              className={`w-16 h-16 border-2 ${
                selectedImage === img.image_url
                  ? 'border-black'
                  : 'border-gray-300'
              } rounded overflow-hidden cursor-pointer`}
            >
              <Image
                src={img.image_url}
                width={64}
                height={64}
                alt={`${product.product_name} thumbnail ${index + 1}`}
                className='w-full h-full object-cover'
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
