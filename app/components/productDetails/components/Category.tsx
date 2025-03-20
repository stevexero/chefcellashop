'use client';

interface CategoryProps {
  productCategory: string | undefined;
}

export default function Category({ productCategory }: CategoryProps) {
  return <p>{(productCategory || 'Uncategorized').toUpperCase()}</p>;
}
