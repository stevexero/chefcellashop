'use client';

interface ProductPriceProps {
  adjustedPrice: number | 0;
}

export default function ProductPrice({ adjustedPrice }: ProductPriceProps) {
  return <p className='mt-4'>${adjustedPrice.toFixed(2)}</p>;
}
