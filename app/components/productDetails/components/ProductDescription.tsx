'use client';

interface ProductDescriptionProps {
  description: string | undefined;
}

export default function ProductDescription({
  description,
}: ProductDescriptionProps) {
  return <p className='mt-4'>{description || ''}</p>;
}
