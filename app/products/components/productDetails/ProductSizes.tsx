import SizeSelector from './SizeSelector';
import { ProductSizesProps } from '@/app/types/types';

export default function ProductSizes({ sizes, basePrice }: ProductSizesProps) {
  return (
    <>
      {sizes?.[0].size_id === '00000000-0000-0000-0000-000000000001' ? (
        <p className='mt-4 text-xs md:text-base'>One Size</p>
      ) : (
        <SizeSelector sizes={sizes} basePrice={basePrice} />
      )}
    </>
  );
}
