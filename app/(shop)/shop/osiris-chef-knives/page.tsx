import OrisisMain from '@/components/shop/orisis/page';
import { fetchProducts } from '@/lib/integration/products/query';

const Orisis: React.FC = async () => {
  const products = await fetchProducts('1269', '', '12');
  return (
    <div>
      <div className='fixed h-screen w-screen overflow-hidden top-0 -z-50'>
        <video
          loop
          autoPlay
          playsInline
          muted
          className='w-full h-full object-cover'
          src='https://damnedventures.com/wp-content/uploads/Hero-Video.mp4'
        >
          <source
            type='video/mp4'
            src='https://damnedventures.com/wp-content/uploads/Hero-Video.mp4'
          />
        </video>
      </div>
      <div className='flex m-auto px-[30px] w-full 2xl:w-[1440px] h-[400px] md:h-[70vh]'>
        <div className='text-white my-auto text-center md:text-left'>
          <p className='text-2xl md:text-3xl font-semibold mb-1'>
            OSIRIS CHEF KNIVES
          </p>
          <p className='text-xs mb-4'>FUNCTION x AESTHETIC</p>
          <p className='text-xs mb-4'>
            We love EDC knives but we love food more! The Osiris knives were
            born out of a burning desire to create a set of knives for
            ourselves. After having them as a staple in our kitchen for the past
            six months and having run a sucessful Kickstarter campaign, our
            intention is is to now bring these remarkably designed, premium
            knives to your kitchen.
          </p>
          <p className='text-xs'>
            Make cooking great again with our Osiris Chef Knives!{' '}
          </p>
        </div>
      </div>
      {/* <div className='absolute 2xl:w-[1440px] px-[30px] w-full text-white'>
        <div className='flex flex-col gap-5'>
          <p className='text-5xl'>OSIRIS CHEF KNIVES</p>
          <p className='text-2xl'>FUNCTION x AESTHETIC</p>
          <p className='text-xl'>
            We love EDC knives but we love food more! The Osiris knives were
            born out of a burning desire to create a set of knives for
            ourselves. After having them as a staple in our kitchen for the past
            six months and having run a sucessful Kickstarter campaign, our
            intention is is to now bring these remarkably designed, premium
            knives to your kitchen.
          </p>
          <p className='text-xl'>
            Make cooking great again with our Osiris Chef Knives!{' '}
          </p>
        </div>
      </div> */}

      <OrisisMain data={products} />
    </div>
  );
};

export default Orisis;
