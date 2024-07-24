import { text } from '@/app/styles';
import DashboardBack from '@/components/dashboardBack';
import OrisisMain from '@/components/shop/orisis/page';
import ProductsList from '@/components/shop/products-listing';
import { Product, fetchProducts } from '@/graphql';

const Orisis = async () => {
  const { nodes: products } = await fetchProducts({
    first: 30,
    where: { categoryId: 1269 },
  });

  return (
    <div>
      <DashboardBack page='chef' />

      <div className='flex m-auto px-8 w-full h-[400px] md:h-screen'>
        <div className='text-white my-auto text-center md:text-left'>
          <p className={`${text.lg} md:text-3xl font-semibold mb-1`}>
            OSIRIS CHEF KNIVES
          </p>
          <p className={`${text.md} mb-4`}>FUNCTION x AESTHETIC</p>
          <p className={`${text.md} mb-4`}>
            We love EDC knives but we love food more! The Osiris knives were
            born out of a burning desire to create a set of knives for
            ourselves. After having them as a staple in our kitchen for the past
            six months and having run a sucessful Kickstarter campaign, our
            intention is is to now bring these remarkably designed, premium
            knives to your kitchen.
          </p>
          <p className={`${text.md} mb-4`}>
            Make cooking great again with our Osiris Chef Knives!{' '}
          </p>
        </div>
      </div>

      <div className=' m-auto px-8 w-full bg-white '>
        <div className='py-[2em] md:py-[5em]'>
          <ProductsList data={products} showPagination={false} />
        </div>
        <div className='h-auto lg:h-screen flex flex-col lg:flex-row py-[2em] md:py-[5em]'>
          <img
            className='w-full  lg:w-1/2 h-full object-contain '
            src='https://admin.damneddesigns.com/wp-content/uploads/Presentation12.gif'
            alt='this is orisis'
          />
          <div className='relative  h-full w-full lg:w-1/2 grid'>
            <img
              className='w-full h-full object-cover'
              src='https://admin.damneddesigns.com/wp-content/uploads/IMG_2642-scaled.jpg'
              alt='this is orisis'
            />
            <div className='absolute text-center self-center p-10  text-white'>
              <p className={`${text.lg} font-semibold`}>MAKE IT YOURS</p>
              <p className={`${text.md} text-slate-400`}>
                With replaceable scales
              </p>
              <p className={`${text.md}`}>
                We are strong advocates of individual expressions fo self and as
                such we have always created products that yu ahve full control
                over. Borrowing from our EDC knives, the Osiris chef knives have
                scales that can be replaced with minimal effort. With many
                handle offerings in the future. you cooking companion cna be
                however you like!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Background = () => {};

export default Orisis;
