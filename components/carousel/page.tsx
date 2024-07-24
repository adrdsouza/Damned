'use client';

interface CarouselProps {
  images: string[];
}

import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { Carousel } from 'react-responsive-carousel';
import Image from 'next/image';
import { useState } from 'react';
import { CircularProgress } from '@mui/material';

const ImageCarousel = ({ images }: CarouselProps) => {
  return (
    <Carousel>
      {images.map((image, index) => (
        <CustomImage key={index} image={image} />
        //<Image key={index} src={image} alt='' width={500} height={500} />
        //<img key={index} src={image} alt='' />
      ))}
    </Carousel>
  );
};

const CustomImage = ({ image }: any) => {
  const [loading, setLoading] = useState(true);
  return (
    <div className='h-full w-full'>
      {loading ? (
        <div className='bg-stone-200 h-full flex w-full'>
          <CircularProgress sx={{ color: 'grey', m: 'auto' }} />
        </div>
      ) : null}

      <Image
        src={image}
        alt=''
        width={500}
        height={500}
        onLoadingComplete={() => setLoading(false)}
      />
    </div>
  );
};
export default ImageCarousel;
