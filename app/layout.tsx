'use client';

import Navbar from '@/components/navbar/page';
import './globals.css';
import FooterBar from '@/components/footer/page';
import { SessionProvider } from '@/client/SessionProvider';
import { Toaster } from 'react-hot-toast';
import ReduxProvider from '@/redux/provider';
import { Montserrat } from 'next/font/google';
import { createTheme, ThemeProvider } from '@mui/material';

const font = Montserrat({
  subsets: ['latin'],
  weight: ['200', '300', '400', '500', '600', '700', '800'],
});

const theme = createTheme({
  typography: {
    fontFamily: `__Montserrat_2f6838', '__Montserrat_Fallback_2f6838`,
  },
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <head>
        <link
          rel='icon'
          href='https://admin.damneddesigns.com/wp-content/uploads/cropped-Asset-d11-32x32.png'
          sizes='32x32'
        />
        <script
          async
          src='https://secure.nmi.com/token/Collect.js'
          // data-tokenization-key='5mN8N7-jhr55W-N22pxX-uAW2s9'
          data-tokenization-key='checkout_public_2he6c5yTBC73u3AV2reJeHb37TpEegUa'
        />
        <script
          async
          type='text/javascript'
          src='https://checkout-sdk.sezzle.com/checkout.min.js'
        />
      </head>

      <body className={font.className} suppressHydrationWarning={true}>
        <ThemeProvider theme={theme}>
          <ReduxProvider>
            <SessionProvider>
              <div className='flex flex-col w-full h-screen'>
                <Navbar />
                <div className='flex-1'>{children}</div>
                <FooterBar />
              </div>
            </SessionProvider>
          </ReduxProvider>
        </ThemeProvider>
        <Toaster />
      </body>
    </html>
  );
}
