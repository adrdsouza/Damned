import FigureItem from '@/components/figureItem';

const Shop: React.FC = () => {
  return (
    <div
      className='
      px-[30px] py-[2em] md:py-[5em]
      2xl:w-[1440px] w-full m-auto 
      grid grid-cols-1 lg:grid-cols-3 gap-5'
    >
      <FigureItem
        className='lg:row-span-3'
        size='h-[300px] lg:h-full'
        image='https://admin.damneddesigns.com/wp-content/uploads/DSC_3388-01.jpeg'
        text='OSIRIS CHEF KNIVES'
        url='/shop/osiris-chef-knives'
      />
      <FigureItem
        className=''
        image='https://admin.damneddesigns.com/wp-content/uploads/77776-01.png'
        text='POCKET KNIVES'
        size='h-[300px]  '
        url='/shop/pocket-knives'
      />
      <FigureItem
        image='https://admin.damneddesigns.com/wp-content/uploads/DSC_0054-02.jpeg'
        text='POCKET ART'
        size='h-[300px] '
        url='/shop/edc'
      />
      <FigureItem
        image='https://admin.damneddesigns.com/wp-content/uploads/IMG_9932.png'
        text='FIXED BLADES'
        size='h-[300px] '
        url='/shop/fixed-blade-knives'
      />
      <FigureItem
        image='https://admin.damneddesigns.com/wp-content/uploads/IMG_3284.png'
        text='APPAREL'
        size='h-[300px] '
        url='/'
      />
      <FigureItem
        image='https://admin.damneddesigns.com/wp-content/uploads/IMG_23fh38.png'
        text='SIDEKICK PRY BARS'
        size='h-[300px] '
        url='/shop/sidekick-pry-bars'
      />
      <FigureItem
        image='https://admin.damneddesigns.com/wp-content/uploads/DSCF7042-scaled.jpg'
        text='POCKET FIDGET'
        size='h-[300px] '
        url='/shop/fidget'
      />
    </div>
  );
};

export default Shop;
