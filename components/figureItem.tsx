import { text } from '@/app/styles';
import Image from 'next/image';
import Link from 'next/link';

const FigureItem = ({ data }: any) => {
  return (
    <Link className='h-full w-full' href={data.href}>
      <figure className='relative flex items-center justify-center h-full w-full'>
        <Image
          src={data.src}
          width={1000}
          height={1000}
          alt=''
          className='h-full w-full object-cover'
        />
        <figcaption className={`${text.md} absolute text-white`}>
          {data.title}
        </figcaption>
      </figure>
    </Link>
  );
};

export default FigureItem;
