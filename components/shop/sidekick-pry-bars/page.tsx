import Image from "next/image";
import SideItem from "@/components/card/card";
import sideBack from "@/public/assets/images/sidekick-back.png";
import sidekickBar4 from "@/public/assets/images/sidekick-bar4.png";
import sidekickBar5 from "@/public/assets/images/sidekick-bar5.png";
import { Product } from "@/lib/graphql/type";

interface SidekideProps {
  data: Product[];
}

const Sidekidkpry: React.FC<SidekideProps> = async (props) => {
  
  return (
    <div>
      <div className="relative flex justify-center items-center">
        <Image
          className="w-screen h-lvh object-cover"
          src={sideBack}
          alt="this is back"
        />
        <div className="absolute text-white">
          <p className="text-4xl">SIDEKICK PRY BARS</p>
          <p className="text-xl lg:mt-4">FUNCTION X AESTHETIC</p>
          <p className="text-lg lg:mt-20">
            Do we love creammig as much functionally into our products as
            possible? Or course, we do!
          </p>
          <p className="text-lg lg:mt-4">
            The Sidekick pry hae mm and inch measuring, a bubble level, a 1/4,
            wrench and driver hole and storage for 1 or 2 bids.
          </p>
          <p className="text-lg">Adn yes, it can pry!</p>
        </div>
      </div>
      <div className="lg:mt-8 flex justify-center gap-8">
        {props.data.map(
          (p, index) =>
            (
              <div className="grid" key={index}>
                <SideItem
                  img={p.node.image && p.node.image.sourceUrl}
                  productId={p.node.id}
                  name={p.node.name}
                  price={p.node.price}
                  onSale={p.node.onSale}
                />
                <p>{p.node.name}</p>
                <p>{p.node.price}</p>
              </div>
            )
        )}
      </div>
      <div className="flex lg:mt-10">
        <Image
          className="w-1/2 h-lvh object-cover"
          src={sidekickBar4}
          alt="this is bar"
        />
        <div className="relative w-1/2 flex justify-center items-center">
          <Image
            className="w-full h-lvh object-cover"
            src={sidekickBar5}
            alt="this is bar"
          />
          <div className="absolute w-2/3 text-center text-white">
            <p className="text-4xl">Do More</p>
            <p className="lg:mt-4 text-3xl text-slate-400">Bit by bit</p>
            <p className="lg:mt-8 text-md">
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
