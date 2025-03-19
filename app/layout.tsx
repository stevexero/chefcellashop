import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from './ui/navigation/navbar';
import UserModal from './components/UserModal';
import { createClient } from './utils/supabase/server';
import AddProductModal from './components/AddProductModal';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
      <body className={`${inter.variable} antialiased`}>
        <Navbar user={user} />
        {children}
        <UserModal user={user} />
        <AddProductModal user={user} />
        <ToastContainer />
      </body>
    </html>
  );
}
