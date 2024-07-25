import FigureItem from '@/components/figureItem';

const data = [
  {
    src: 'https://admin.damneddesigns.com/wp-content/uploads/DSC_3388-01.jpeg',
    title: 'OSIRIS CHEF KNIVES',
    href: '/shop/osiris-chef-knives',
  },
  {
    src: 'https://admin.damneddesigns.com/wp-content/uploads/77776-01.png',
    title: 'POCKET KNIVES',
    href: '/shop/pocket-knives',
  },
  {
    src: 'https://admin.damneddesigns.com/wp-content/uploads/DSC_0054-02.jpeg',
    title: 'POCKET ART',
    href: '/shop/edc',
  },
  {
    src: 'https://admin.damneddesigns.com/wp-content/uploads/IMG_9932.png',
    title: 'FIXED BLADES',
    href: '/shop/fixed-blade-knives',
  },
  {
    src: 'https://admin.damneddesigns.com/wp-content/uploads/IMG_3284.png',
    title: 'APPAREL',
    href: '/',
  },
  {
    src: 'https://admin.damneddesigns.com/wp-content/uploads/IMG_23fh38.png',
    title: 'SIDEKICK PRY BARS',
    href: '/shop/sidekick-pry-bars',
  },
  {
    src: 'https://admin.damneddesigns.com/wp-content/uploads/DSCF7042-scaled.jpg',
    title: 'POCKET FIDGET',
    href: '/shop/fidget',
  },
];

const Shop = () => {
  return (
    <div
      className='overflow-hidden
      px-8 py-4 h-fit lg:h-screen
      w-full m-auto 
      grid grid-cols-1 lg:grid-rows-3 lg:grid-cols-3'
    >
      <div className='h-auto row-span-1 lg:row-span-3 col-span-1 '>
        <FigureItem data={data[0]} />
      </div>

      <div className='h-auto row-span-1 col-span-1 '>
        <FigureItem data={data[1]} />
      </div>

      <div className='h-auto row-span-1 col-span-1 '>
        <FigureItem data={data[2]} />
      </div>

      <div className='h-auto row-span-1 col-span-1 '>
        <FigureItem data={data[3]} />
      </div>

      <div className='h-auto row-span-1 col-span-1'>
        <FigureItem data={data[4]} />
      </div>

      <div className='h-auto row-span-1 col-span-1'>
        <FigureItem data={data[5]} />
      </div>

      <div className='h-auto row-span-1 col-span-1 '>
        <FigureItem data={data[6]} />
      </div>

      {/* <FigureItem
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
      /> */}
    </div>
  );
};

export default Shop;
