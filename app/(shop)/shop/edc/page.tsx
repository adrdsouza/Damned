import EdcMain from '@/components/shop/edc/page';
import EdcBack from '@/components/shop/edc/edcBack';
import { fetchProducts } from '@/lib/integration/products/query';

const Edc: React.FC = async () => {
  const products = await fetchProducts('1143');
  return (
    <div>
      {/* <EdcBack /> */}

      <div className='fixed h-screen w-screen overflow-hidden left-0 top-0 -z-50'>
        <video
          loop
          autoPlay
          playsInline
          muted
          className='w-full h-full object-cover'
          src='https://damnedventures.com/wp-content/uploads/EDC.mp4'
        >
          <source
            type='video/mp4'
            src='https://damnedventures.com/wp-content/uploads/EDC.mp4'
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
      <div className='w-full bg-white'>
        <EdcMain className='' data={products} />
      </div>
    </div>
  );
};

export default Edc;
