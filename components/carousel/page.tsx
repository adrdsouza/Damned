'use client';

import Image from 'next/image';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

interface CarouselProps {
  images: string[];
}

const Carousel: React.FC<CarouselProps> = ({ images }) => {
  const settings = {
    dots: true,
    infinite: true,
    autoplay: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  return (
    <div className='w-full'>
      <Slider {...settings}>
        {images.map((image, index) => (
          <div key={index}>
            <Image
              src={`${image}`}
              alt=''
              width={1000}
              height={1000}
              className='h-full'
            />
          </div>
        ))}
        {images.length < 2 &&
          images.map((image, index) => (
            <div key={index}>
              <Image
                src={`${image}`}
                alt=''
                width={1000}
                height={500}
                className='h-[700px]'
              />
            </div>
          ))}
      </Slider>
    </div>
  );
};

export default Carousel;
