import { ProductNameProps } from '@/app/types/types';

export default function ProductName({ productName }: ProductNameProps) {
  return (
    <p className='mt-4 font-bold text-xl md:text-2xl'>
      {(productName || '').replaceAll('-', ' ').toUpperCase()}
    </p>
  );
}
