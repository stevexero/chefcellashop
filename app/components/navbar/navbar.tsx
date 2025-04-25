'use client';

import Image from 'next/image';
import TopNavLinks from './top-nav-links';
import Link from 'next/link';
import { Button } from '../../ui/button';
import { signOutAction } from '@/app/(auth-pages)/actions/actions';
import { User } from '@supabase/supabase-js';
import { usePathname } from 'next/navigation';

interface NavbarProps {
  user: User | null;
}

const Navbar = ({ user }: NavbarProps) => {
  const pathname = usePathname();

  return (
    <div className='w-screen'>
      {user && pathname === '/dashboard' ? null : (
        <>
          {pathname.startsWith('/dashboard') ? null : (
            <div className='w-full p-4 grid grid-cols-2 md:grid-cols-3 justify-items-center items-center bg-black'>
              <p className='hidden md:block text-white text-xs'>
                SHIPPING INCLUDED WITH ALL ORDERS!
              </p>
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
          )}
        </>
      )}
      <div className='w-full md:grid md:grid-cols-3 justify-items-center items-center p-2 border-b border-b-slate-300 text-center'>
        <div></div>
        {user && pathname === '/dashboard' ? null : (
          <>
            {pathname.startsWith('/dashboard') ? null : (
              <div className='flex flex-row items-center justify-center'>
                <p className='text-xs md:text-base'>
                  All orders processed and shipped the same day!
                </p>
                <Link
                  href='/track-order'
                  className='ml-4 underline text-blue-500'
                >
                  Track Order Here
                </Link>
              </div>
            )}
          </>
        )}
        {user ? (
          <div className='flex gap-2'>
            <form action={signOutAction}>
              <Button type='submit' variant={'outline'} className='text-black'>
                Sign out
              </Button>
            </form>
            {pathname === '/dashboard' ? null : (
              <Link href='/dashboard'>
                <Button variant={'default'}>Dashboard</Button>
              </Link>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default Navbar;
