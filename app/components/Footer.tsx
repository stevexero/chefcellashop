import Link from 'next/link';

export default function Footer() {
  return (
    <footer className='w-full p-9 bg-black text-white flex-shrink-0'>
      <div className='flex justify-center items-center gap-4'>
        <Link href='/support'>Support</Link>
        <Link href='/terms-of-service'>Terms of Service</Link>
        <Link href='/privacy-policy'>Privacy Policy</Link>
      </div>
    </footer>
  );
}
