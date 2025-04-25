import { ProductPriceProps } from '@/app/types/types';

export default function ProductPrice({ adjustedPrice }: ProductPriceProps) {
  return <p className='mt-4'>${adjustedPrice.toFixed(2)}</p>;
}
