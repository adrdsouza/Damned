import Image from 'next/image';
import SideItem from '@/components/card/card';
import { Product } from '@/lib/graphql/type';

interface SidekideProps {
  data: Product[];
}

const Sidekidkpry: React.FC<SidekideProps> = async (props) => {
  return (
    <div>
      <div className='relative flex justify-center items-center'>
        <Image
          className='w-screen h-lvh object-cover'
          src='https://admin.damneddesigns.com/wp-content/uploads/IMG_23fh38.png'
          width={1000}
          height={1000}
          alt='this is back'
        />
        <div className='absolute text-white'>
          <p className='text-4xl'>SIDEKICK PRY BARS</p>
          <p className='text-xl lg:mt-4'>FUNCTION X AESTHETIC</p>
          <p className='text-lg lg:mt-20'>
            Do we love creammig as much functionally into our products as
            possible? Or course, we do!
          </p>
          <p className='text-lg lg:mt-4'>
            The Sidekick pry hae mm and inch measuring, a bubble level, a 1/4,
            wrench and driver hole and storage for 1 or 2 bids.
          </p>
          <p className='text-lg'>Adn yes, it can pry!</p>
        </div>
      </div>
      <div className='lg:mt-8 flex xl:px-96 justify-center gap-8'>
        {props.data.map((p, index) => (
          <div className='grid' key={index}>
            <SideItem
              img={p.node.image && p.node.image.sourceUrl}
              productId={p.node.id}
              name={p.node.name}
              price={p.node.price}
              onSale={p.node.onSale}
            />
          </div>
        ))}
      </div>
      <div
        className='flex lg:mt-10'
        style={{
          backgroundImage:
            "url('https://admin.damneddesigns.com/wp-content/uploads/1626981433015-scaled-e1714662604922.jpg')",
          backgroundSize: 'cover',
        }}
      >
        <Image
          className='w-1/2 h-lvh object-cover'
          src='https://admin.damneddesigns.com/wp-content/uploads/IMG_5234.jpg'
          width={1000}
          height={1000}
          alt='this is bar'
        />
        <div className='w-1/2 flex justify-center items-center'>
          <div className='w-2/3 text-center text-white'>
            <p className='text-4xl'>Do More</p>
            <p className='lg:mt-4 text-3xl text-slate-300 italic'>Bit by bit</p>
            <p className='lg:mt-8 text-md'>
              Want to maintainyour knife on the gor? Replace the supplied bits
              with the relevant torq bits in our bit storage compatments with
              magnetic lids and your good to go!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidekidkpry;
