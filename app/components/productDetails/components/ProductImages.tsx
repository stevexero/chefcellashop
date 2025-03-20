'use client';

import Image from 'next/image';
import { useState } from 'react';

interface ProductImage {
  image_url: string;
}

interface Color {
  color_id: string;
  color_name: string;
  color_hex_code: string;
}

interface Size {
  size_id: string;
  size: string;
}

interface ProductSize {
  size_id: string;
  price_mod: number;
  size: Size;
}

interface Category {
  category_id: string;
  category_name: string;
}

interface Product {
  product_id: string;
  product_name: string;
  base_price: number;
  description?: string;
  category_id: string;
  product_images: ProductImage[];
  product_colors: { color: Color }[];
  product_sizes: ProductSize[];
  categories: Category;
}

interface ProductProps {
  product: Product;
}

export default function ProductImages({ product }: ProductProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(
    product.product_images && product.product_images.length > 0
      ? product.product_images[0].image_url
      : null
  );

  const handleThumbnailClick = (imageUrl: string) => {
    setSelectedImage(imageUrl);
  };

  return (
    <div className='flex flex-col items-center'>
      {selectedImage ? (
        <Image
          src={selectedImage}
          width={700}
          height={700}
          alt={product.product_name}
          className='max-w-[600px] max-h-[600px] object-contain'
        />
      ) : (
        <div className='max-w-[600px] max-h-[600px] bg-gray-200 flex items-center justify-center'>
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
