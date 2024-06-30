// import type { Metadata } from "next";
import Navbar from '@/components/navbar/page';
import { Inter } from 'next/font/google';
import './globals.css';
import FooterBar from '@/components/footer/page';
import { GoodProvider } from '@/components/context/GoodContext';
import { SessionProvider } from '@/client/SessionProvider';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body suppressHydrationWarning={true} className={inter.className}>
        <SessionProvider>
          <GoodProvider>
            <Navbar />
            {children}
            <FooterBar />
          </GoodProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
