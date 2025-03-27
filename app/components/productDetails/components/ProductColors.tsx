'use client';

import ColorSelector from './ColorSelector';

interface Color {
  color_id: string;
  color_name: string;
  color_hex_code: string;
}

interface ProductColorsProps {
  colors: { color: Color }[];
}

export default function ProductColors({ colors }: ProductColorsProps) {
  return (
    <>
      {colors?.length > 0 ? (
        <ColorSelector colors={colors} />
      ) : (
        <p className='mt-4 text-xs md:text-base'>
          <span className='font-bold'>COLOR:</span> N/A
        </p>
      )}
    </>
  );
}
