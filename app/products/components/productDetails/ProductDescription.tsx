import { ProductDescriptionProps } from '@/app/types/types';

export default function ProductDescription({
  description,
}: ProductDescriptionProps) {
  return <p className='mt-4 text-xs md:text-base'>{description || ''}</p>;
}
