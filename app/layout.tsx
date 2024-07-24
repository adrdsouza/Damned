import Navbar from '@/components/navbar/page';
import './globals.css';
import FooterBar from '@/components/footer/page';
import { SessionProvider } from '@/client/SessionProvider';
import { Toaster } from 'react-hot-toast';
import ReduxProvider from '@/redux/provider';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body suppressHydrationWarning={true}>
        <ReduxProvider>
          <SessionProvider>
            <div className='flex flex-col w-full h-screen'>
              <Navbar />
              <div className='flex-1'>{children}</div>
              <FooterBar />
            </div>
          </SessionProvider>
        </ReduxProvider>
        <Toaster />
      </body>
    </html>
  );
}
