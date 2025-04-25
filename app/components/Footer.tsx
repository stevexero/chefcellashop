'use client';

import Link from 'next/link';
import { User } from '@supabase/supabase-js';
import { usePathname } from 'next/navigation';

export default function Footer({ user }: { user: User | null }) {
  const pathname = usePathname();

  return (
    <>
      {user && pathname === '/dashboard' ? null : (
        <>
          {pathname.startsWith('/dashboard') ? null : (
            <footer className='w-full p-9 bg-black text-white flex-shrink-0'>
              <div className='flex justify-center items-center gap-4'>
                <Link href='/support'>Support</Link>
                <Link href='/terms-of-service'>Terms of Service</Link>
                <Link href='/privacy-policy'>Privacy Policy</Link>
                <Link href='/dashboard'>Admin</Link>
              </div>
            </footer>
          )}
        </>
      )}
    </>
  );
}
