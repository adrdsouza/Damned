import Image from "next/image";

interface FigureItemProps {
  className?: string;
  image?: any;
  text?: string;
  url?: string;
  size?: string;
}

const FigureItem: React.FC<FigureItemProps> = (props) => {
  return (
    <div className={`${props.className} grid rounded-xl`}>
      <figure className={`${props.size} relative flex items-center justify-center rounded-xl`}>
        <Image src={props.image} alt="this is Back" className="lg:h-full w-full object-cover rounded-xl" />
        <figcaption className="absolute text-white">
          <a href={`${props.url}`}>{props.text}</a>
        </figcaption>
      </figure>
    </div>
  );
};

export default FigureItem;
