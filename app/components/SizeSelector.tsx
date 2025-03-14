'use client';

import { useClientStore } from '../store/clientStore';

interface Size {
  size: string;
}

interface SizeSelectorProps {
  sizes: Size[];
  onSelect?: (size: string) => void;
}

export default function SizeSelector({ sizes, onSelect }: SizeSelectorProps) {
  const { selectedSize, setSelectedSize } = useClientStore();

  const handleSizeClick = (size: string) => {
    setSelectedSize(size);
    if (onSelect) {
      onSelect(size);
    }
  };

  return (
    <>
      <div className='mt-4 flex'>
        <span className='font-bold'>Size:</span>
        {sizes?.length > 0 ? (
          <p className='ml-2'>{selectedSize}</p>
        ) : (
          <p className='ml-2'>One Size</p>
        )}
      </div>
      <div className='mt-2 inline-flex flex-row border-2 border-slate-700'>
        {sizes && sizes.length > 0
          ? sizes.map((s, index) => (
              <div
                key={index}
                className={`w-12 h-12 flex items-center justify-center cursor-pointer hover:bg-slate-700 hover:text-white ${
                  selectedSize === s.size ? 'bg-slate-700 text-white' : ''
                }`}
                onClick={() => handleSizeClick(s.size)}
              >
                {s.size}
              </div>
            ))
          : null}
      </div>
    </>
  );
}
