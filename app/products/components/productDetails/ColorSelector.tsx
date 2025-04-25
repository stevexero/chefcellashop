'use client';

import { useEffect } from 'react';
import { useProductsStore } from '../../store';
import { ColorProps, ProductColorSelectorProps } from '@/app/types/types';

export default function ColorSelector({ product }: ProductColorSelectorProps) {
  const {
    selectedColorId,
    selectedColorName,
    setSelectedColorId,
    setSelectedColorName,
    initializeColor,
    setSelectedImage,
  } = useProductsStore();

  const handleColorChange = (color: ColorProps) => {
    setSelectedColorId('');
    setSelectedColorId(color.color_id);
    setSelectedColorName(color.color_name);
    setSelectedImage(
      product.product_images.find((image) => image.color_id === color.color_id)
        ?.image_url || ''
    );
  };

  useEffect(() => {
    initializeColor(product.product_colors);
  }, [product.product_colors, initializeColor]);

  useEffect(() => {
    console.log(selectedColorId);
  }, [selectedColorId]);

  return (
    <div className='border rounded-md md:border-none md:rounded-none p-2 mt-4 flex flex-row items-center justify-between md:flex-col md:items-start md:justify-start'>
      <p className='text-xs md:text-base'>
        <span className='font-bold'>COLOR:&nbsp;</span>
        {selectedColorName || 'N/A'}
      </p>
      <div className='flex gap-2 mt-0 md:mt-2'>
        {product.product_colors.map(({ color }) => (
          <button
            key={color.color_id}
            type='button'
            onClick={() => handleColorChange(color)}
            className={`w-8 h-8 rounded-full border-2 ${
              selectedColorId === color.color_id
                ? 'border-black'
                : 'border-gray-300'
            } cursor-pointer`}
            style={{ backgroundColor: color.color_hex_code }}
            title={color.color_name}
          >
            <span className='sr-only'>{color.color_name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
