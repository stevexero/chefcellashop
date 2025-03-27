'use client';

interface ProductNameProps {
  productName: string | undefined;
}

export default function ProductName({ productName }: ProductNameProps) {
  return (
    <p className='mt-4 font-bold text-xl md:text-2xl'>
      {(productName || '').replaceAll('-', ' ').toUpperCase()}
    </p>
  );
}
