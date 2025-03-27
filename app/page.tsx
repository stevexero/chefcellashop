import Link from 'next/link';

export default function Home() {
  return (
    <div className='w-full font-[family-name:var(--font-inter)] p-4 md:p-0'>
      <main className='w-full flex flex-col items-center justify-center mt-12'>
        <h1 className='text-4xl font-bold text-center'>
          Welcome to the Chef Cella Site!
        </h1>
        <p className='text-base md:text-lg mt-4 text-center'>
          This is a site for the Chef Cella brand. It is a work in progress and
          will be updated as we add more products and features.
        </p>
        <p className='mt-4 font-bold text-2xl text-center'>
          In the mean time, check out our products!
        </p>
        <p className='text-2xl md:text-3xl mt-4 text-center'>
          👇👇👇👇👇👇👇👇👇👇👇👇👇👇
        </p>
        <Link href='/products' className='button-85 mt-8'>
          See all Products
        </Link>
      </main>
    </div>
  );
}
