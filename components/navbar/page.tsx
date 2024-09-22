'use client';

import { UserCircle } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import SearchBar from './search-bar';
import ShopDropdown from './shop-dropdown';
import Cart from '../cart';
import { processNmiPayment } from '@/app/nmi';

const Page = () => {
  const path = usePathname();

  const [navStyle, setNavStyle] = useState<Boolean>(
    path === '/' || path === '/shop/osiris-chef-knives' || path === '/shop/edc'
  );

  // const processNMI = async () => {
  //   try {
  //     const order = {
  //       id: 'b3JkZXI6NTMwOTA=',
  //       databaseId: 53090,
  //       orderKey: 'wc_order_JcqYbdQgFGxiT',
  //       orderNumber: '53090',
  //       status: 'PROCESSING',
  //       date: '2024-08-06T18:39:38+00:00',
  //       paymentMethodTitle: 'NMI',
  //       subtotal: '$75.00',
  //       shippingTotal: '$8.00',
  //       shippingTax: '$0.00',
  //       discountTotal: '$0.00',
  //       discountTax: '$0.00',
  //       totalTax: '$0.00',
  //       total: '$83.00',
  //       billing: {
  //         firstName: 'test from nextjs',
  //         lastName: 'Kamal',
  //         company: null,
  //         address1: 'Lahore',
  //         address2: 'Lahore',
  //         city: 'Lahore',
  //         state: 'PB',
  //         postcode: '54000',
  //         country: 'PK',
  //         email: 'fareedkamal.dev@gmail.com',
  //         phone: '77777777777',
  //       },
  //       shipping: {
  //         firstName: null,
  //         lastName: null,
  //         company: null,
  //         address1: null,
  //         address2: null,
  //         city: null,
  //         state: null,
  //         postcode: null,
  //         country: null,
  //         email: null,
  //         phone: null,
  //       },
  //       lineItems: {
  //         nodes: [
  //           {
  //             id: 'b3JkZXJfaXRlbTo1MzA5MCs3MzgxNA==',
  //             databaseId: 73814,
  //             product: {
  //               node: {
  //                 id: 'cHJvZHVjdDo0MTEyNQ==',
  //                 databaseId: 41125,
  //                 name: 'Basilisk Fixed',
  //                 slug: 'basilisk-fixed',
  //                 type: 'VARIABLE',
  //                 image: {
  //                   id: 'cG9zdDo0OTIyNQ==',
  //                   sourceUrl:
  //                     'https://admin.damneddesigns.com/wp-content/uploads/DSC_0219-01-800x600.png',
  //                   altText: '',
  //                 },
  //                 price: '$75.00',
  //                 regularPrice: '$75.00',
  //                 salePrice: null,
  //                 stockStatus: 'IN_STOCK',
  //                 stockQuantity: null,
  //                 soldIndividually: false,
  //               },
  //             },
  //             variation: {
  //               node: {
  //                 id: 'cHJvZHVjdF92YXJpYXRpb246NDExNDc=',
  //                 databaseId: 41147,
  //                 name: 'Basilisk Fixed - Black G10, Stonewashed 14c28n',
  //                 slug: 'basilisk-fixed',
  //                 type: 'VARIATION',
  //                 image: {
  //                   id: 'cG9zdDo0OTIyNQ==',
  //                   sourceUrl:
  //                     'https://admin.damneddesigns.com/wp-content/uploads/DSC_0219-01-800x600.png',
  //                   altText: '',
  //                 },
  //                 price: '$75.00',
  //                 regularPrice: '$75.00',
  //                 salePrice: null,
  //                 stockStatus: 'IN_STOCK',
  //                 stockQuantity: 1,
  //                 soldIndividually: null,
  //               },
  //             },
  //             quantity: 1,
  //             total: '75',
  //             subtotal: '75',
  //             subtotalTax: null,
  //           },
  //         ],
  //       },
  //     };

  //     const token = {
  //       tokenType: 'inline',
  //       token: 'gpxE2G97-exjG7C-xAvdqk-f7b5972P88zJ',
  //       card: {
  //         number: '559049******1142',
  //         bin: '559049',
  //         exp: '0628',
  //         type: 'mastercard',
  //         hash: '',
  //       },
  //       check: {
  //         name: null,
  //         account: null,
  //         aba: null,
  //         transit: null,
  //         institution: null,
  //         hash: null,
  //       },
  //       wallet: {
  //         cardDetails: null,
  //         cardNetwork: null,
  //         email: null,
  //         billingInfo: {
  //           address1: null,
  //           address2: null,
  //           firstName: null,
  //           lastName: null,
  //           postalCode: null,
  //           city: null,
  //           state: null,
  //           country: null,
  //           phone: null,
  //         },
  //         shippingInfo: {
  //           method: null,
  //           address1: null,
  //           address2: null,
  //           firstName: null,
  //           lastName: null,
  //           postalCode: null,
  //           city: null,
  //           state: null,
  //           country: null,
  //           phone: null,
  //         },
  //       },
  //     };

  //     const data = {
  //       order: order,
  //       token: token,
  //     };

  //     const res = await fetch(`${process.env.FRONTEND_URL}/api/process-nmi`, {
  //       method: 'POST',
  //       body: JSON.stringify(data),
  //       headers: {
  //         'Content-Type': 'application/json',
  //         Accept: 'application/json',
  //       },
  //     });

  //     const resData = await res.json();
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  const processNMI = async () => {
    try {
      const res = await processNmiPayment();
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    setNavStyle(
      path === '/' ||
        path === '/shop/osiris-chef-knives' ||
        path === '/shop/edc'
    );
  }, [path]);

  return (
    <div
      className={`flex w-full transition-all duration-300 justify-between items-end py-4 px-8
         ${
           navStyle
             ? ' text-white'
             : 'text-slate-700 bg-white border-b border-stone-200'
         }
         `}
    >
      <button onClick={processNMI}>proces nmi</button>
      <Link href='/'>
        {navStyle ? (
          <Image
            src='https://admin.damneddesigns.com/wp-content/uploads/Asset-12.png'
            width={100}
            height={100}
            alt='this is mark'
            className='w-8'
          />
        ) : (
          <Image
            src='https://admin.damneddesigns.com/wp-content/uploads/Asset-14.png'
            width={100}
            height={100}
            alt='this is mark'
            className='w-8'
          />
        )}
      </Link>
      <div className='flex items-center gap-4'>
        <ShopDropdown />

        <Link href='/help' className='hidden sm:block hover:text-slate-400'>
          HELP
        </Link>

        <SearchBar />
      </div>

      <div className='flex gap-4 items-end '>
        <Cart />
        <Link href='/my-account'>
          <UserCircle className='h-5 w-5' />
        </Link>
      </div>
    </div>
  );
};

export default Page;
