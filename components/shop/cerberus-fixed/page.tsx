import Image from "next/image";

interface CerberusProps {
  className?: string;
  img?: any;
  title?: string;
  price?: string;
  detail?: string;
}

const Cerberus: React.FC<CerberusProps> = (props) => {
  return (
    <div className="flex">
      <Image className="w-1/2" src={props.img} alt="this is imge" />
      <div>
        <p className="text-4xl">{props.title}</p>
        <p>{props.price}</p>
        <button className="px-10 py-2 text-white text-center rounded bg-gray-200 hover:bg-gray-100">
          ADD TO CART
        </button>
        <p>{props.detail}</p>
      </div>
    </div>
  );
};

export default Cerberus;
