import Image from 'next/image';
import TopNavLinks from './top-nav-links';
import Link from 'next/link';
import { Button } from '../../ui/components/button';
import { signOutAction } from '@/app/lib/actions/actions';
import { User } from '@supabase/supabase-js';

interface NavbarProps {
  user: User | null;
}

const Navbar = async ({ user }: NavbarProps) => {
  return (
    <div className='w-screen'>
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
      <div className='w-full md:grid md:grid-cols-3 justify-items-center items-center p-2 border-b border-b-slate-300 text-center'>
        <div></div>
        <p className='text-xs md:text-base'>
          All orders processed and shipped the same day!
        </p>
        {
          user ? (
            <form action={signOutAction}>
              <Button type='submit' variant={'outline'} className='text-black'>
                Sign out
              </Button>
            </form>
          ) : null
          // <div className='flex gap-2'>
          //   <Button
          //     asChild
          //     size='sm'
          //     variant={'outline'}
          //     className='text-black'
          //   >
          //     <Link href='/sign-in'>Sign in</Link>
          //   </Button>
          //   <Button
          //     asChild
          //     size='sm'
          //     variant={'default'}
          //     className='text-black'
          //   >
          //     <Link href='/sign-up'>Sign up</Link>
          //   </Button>
          // </div>
        }
      </div>
    </div>
  );
};

export default Navbar;
