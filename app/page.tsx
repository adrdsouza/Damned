import Image from 'next/image';
import Shop from './shop/page';
import Link from 'next/link';
import Cards from '@/components/dashboard/cards/page';
import Ticket from '@/components/dashboard/tickets/page';
import DashboardBack from '@/components/dashboardBack';
import HeroSection from '@/components/hero-section/hero-section';
import { text } from './styles';
import { Metadata } from 'next';
import moment from 'moment';
import { getReviews } from '@/lib/graphql';

export const metadata: Metadata = {
  title: 'Homepage - Damned Designs',
  description:
    'We are on a mission to create well designed, high quality products that are effective, reliable yet affordable. We design products that look great but work',
  openGraph: {
    type: 'website',
    url: process.env.OFFICIAL_URL,
    siteName: 'Damned Designs',
    locale: 'en_US',
  },
};

export default async function Home() {
  let reviews;
  const res: any = await getReviews();
  if (res) {
    reviews = res?.trustpilotReviews.map((d: any) => {
      const json = JSON.parse(d?.json_data ?? '');
      if (json !== '') {
        return {
          id: json?.review_id ?? '',
          text: json?.text ?? '',
          rating: json?.rating ?? '',
          name: json?.reviewer?.name ?? '',
          time: moment(d?.time_stamp ?? '').fromNow(),
        };
      }
    });
  }

  return (
    <main className='flex flex-col'>
      <DashboardBack page='home' />
      <HeroSection />
      <div className='bg-white w-full'>
        <div className='w-full px-8 m-auto'>
          <div className='py-[1em] md:py-[5em] flex gap-8 w-full flex-col items-center md:flex-row justify-center'>
            <div className='flex-1 flex justify-end'>
              <Image
                className='mt-[-50px] md:mt-[-150px] '
                src='https://admin.damneddesigns.com/wp-content/uploads/996A9287-4-e1714822334887.png'
                width={500}
                height={500}
                alt='this is knife'
              />
            </div>
            <div className='flex-1 justify-center flex flex-col gap-2 text-center md:text-left items-center md:items-start'>
              <p className={`${text.lg} font-normal`}>OSIRIS CHEF KNIVES</p>
              <p className={`${text.md} font-normal`}>
                After years of being part of countless pockets in the fidget,
                EDCC and knife communities, we are coming for your kitchen!
              </p>
              <Link
                href='/shop/osiris-chef-knives'
                className=' w-fit px-6 py-2 border-[1px] border-black hover:bg-slate-100 group/button flex justify-center transition duration-300'
              >
                <p className={`${text.md}`}>LEARN MORE</p>
                <svg
                  className='h-6 w-6 text-slate-300 hidden group-hover/button:block'
                  viewBox='0 0 24 24'
                  strokeWidth='2'
                  stroke='currentColor'
                  fill='none'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                >
                  {' '}
                  <path stroke='none' d='M0 0h24v24H0z' />{' '}
                  <polyline points='9 6 15 12 9 18' />
                </svg>
              </Link>
            </div>
          </div>

          {reviews ? <Cards reviews={reviews} /> : null}

          <Ticket />
        </div>
        <Shop />
      </div>
    </main>
  );
}
