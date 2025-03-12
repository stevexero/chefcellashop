import Image from 'next/image';
import TopNavLinks from './top-nav-links';
import Link from 'next/link';

const Navbar = () => {
  return (
    <div className='w-screen'>
      <div className='w-full p-4 grid grid-cols-3 justify-items-center items-center bg-black'>
        <p className='text-white text-xs'>SHIPPING INCLUDED WITH ALL ORDERS!</p>
        <Link href='/'>
          <Image
            src='/frontlogocut.png'
            width={100}
            height={100}
            alt='chef cella logo'
          />
        </Link>
        <TopNavLinks />
      </div>
      <div className='w-full p-2 border-b border-b-slate-300 text-center'>
        All orders processed and shipped the same day!
      </div>
    </div>
  );
};

export default Navbar;
