// import type { Metadata } from "next";
import Navbar from '@/components/navbar/page';
import { Inter } from 'next/font/google';
import './globals.css';
import FooterBar from '@/components/footer/page';
import { GoodProvider } from '@/components/context/GoodContext';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body className={inter.className}>
        <GoodProvider>
          <Navbar />
          {children}
          <FooterBar />
        </GoodProvider>
      </body>
    </html>
  );
}
