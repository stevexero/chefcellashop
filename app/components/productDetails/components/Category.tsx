'use client';

interface CategoryProps {
  productCategory: string | undefined;
}

export default function Category({ productCategory }: CategoryProps) {
  return (
    <p className='text-xs md:text-base'>
      {(productCategory || 'Uncategorized').toUpperCase()}
    </p>
  );
}
