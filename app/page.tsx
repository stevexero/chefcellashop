import Link from 'next/link';

export default function Home() {
  return (
    <div className='w-full font-[family-name:var(--font-inter)]'>
      <main className='w-full flex justify-center mt-12'>
        <Link href='/products' className='button-85'>
          See all Products
        </Link>
      </main>
    </div>
  );
}
