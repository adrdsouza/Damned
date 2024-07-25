import Image from 'next/image';
import Link from 'next/link';

interface FigureItemProps {
  className?: string;
  image?: string;
  text?: string;
  url: string;
  size?: string;
}

const FigureItem: React.FC<FigureItemProps> = (props) => {
  return (
    <Link className={`${props.className} `} href={{ pathname: props.url }}>
      <figure
        className={`${props.size} relative flex items-center justify-center`}
      >
        <Image
          src={`${props.image}`}
          width={1000}
          height={1000}
          alt='this is Back'
          className='h-full w-full object-cover hover:opacity-50'
        />
        <figcaption className='absolute text-white'>{props.text}</figcaption>
      </figure>
    </Link>
  );
};

export default FigureItem;
