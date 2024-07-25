import DashboardBack from '@/components/dashboardBack';
import ProductsList from '@/components/shop/products-listing';
import { fetchProducts } from '@/graphql';

const Edc = async () => {
  const { nodes: products } = await fetchProducts({
    first: 50,
    where: { categoryId: 1143 },
  });

  return (
    <div>
      <DashboardBack page='edc' />

      <div className='flex m-auto px-8 w-full h-[400px] md:h-screen'>
        <div className='text-white my-auto text-center md:text-left'>
          <p className='text-2xl md:text-3xl mb-2'>POCKET ART</p>
          <p className='text-base mb-4'>
            From knucks to beads from patches to coins. This is where you’ll
            find them.
          </p>
        </div>
      </div>

      <div className='flex m-auto px-8 min-h-[500px] h-full py-8 bg-white w-full'>
        <ProductsList data={products} showPagination={true} />
      </div>
    </div>
  );
};

export default Edc;
