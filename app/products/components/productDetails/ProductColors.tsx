import { ProductColorsProps } from '@/app/types/types';
import ColorSelector from './ColorSelector';

export default function ProductColors({ product }: ProductColorsProps) {
  return (
    <>
      {product?.product_colors?.length > 0 ? (
        <ColorSelector product={product} />
      ) : (
        <p className='mt-4 text-xs md:text-base'>
          <span className='font-bold'>COLOR:</span> N/A
        </p>
      )}
    </>
  );
}
