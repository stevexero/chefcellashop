import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from './components/navbar/navbar';
import UserModal from './components/UserModal';
import { createClient } from './utils/supabase/server';
import AddProductModal from './components/addProduct/components/AddProductModal';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CartModal from './components/cartDetails/components/CartModal';
import Footer from './components/Footer';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Chef Cella Shop',
  description: 'Shop exclusive items from Chef Cella',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <html lang='en'>
      <body
        className={`${inter.variable} antialiased min-h-screen flex flex-col`}
      >
        <Navbar user={user} />
        <main className='flex-grow'>{children}</main>
        <UserModal user={user} />
        <AddProductModal />
        <CartModal />
        <ToastContainer />
        <Footer />
      </body>
    </html>
  );
}
