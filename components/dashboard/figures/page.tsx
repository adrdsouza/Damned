import PocketOsiris from "@/public/assets/images/pocket-osiris.jpeg";
import PocketKnives from "@/public/assets/images/pocket-knives.png";
import PocketBlades from "@/public/assets/images/pocket-blades.png";
import PocketSidekick from "@/public/assets/images/pocket-sidekick.png";
import PocketArt from "@/public/assets/images/pocket-art.jpeg";
import PocketApparel from "@/public/assets/images/pocket-apparel.png";
import PocketFidget from "@/public/assets/images/pocket-pidget.jpg";

import FigureItem from "./figureItem";
import { Category } from "@/lib/graphql/type";

interface FigureProps {
  className?: string;
  data: Category[];
}

const Figure: React.FC<FigureProps> = (props) => {
  console.log(props);
  return (
    <div className={`${props.className}`}>
      <div className="px-20 py-10 grid grid-flow-row-dense grid-cols-3 gap-5">
        {
          props.data.map((d, index)=> d.image && (
            <FigureItem className={`${index == 0 && 'row-start-1 row-span-3'}`} image={`${d.image.sourceUrl}`} text={d.name} size="h-64" url={d.uri} key={index} />            
          ))
        } 
        {/* <FigureItem className="row-start-1 row-span-3" image={PocketOsiris} text="OSIRIS CHEF KNIVES" url="/shop/orisis" />
        <FigureItem image={PocketKnives} text="POCKET KNIVES" size="h-64" url="/shop/pocket-knives" />
        <FigureItem image={PocketBlades} text="FIXED BLADES" size="h-64" url="/shop/fixed-blade-knives" />
        <FigureItem image={PocketSidekick} text="SIDEKICK PRY BARS" size="h-64" url="/shop/sidekick-pry-bars" />
        <FigureItem image={PocketArt} text="POCKET ART" size="h-64" url="/shop/art" />
        <FigureItem image={PocketApparel} text="APPAREL" size="h-64" url="" />
        <FigureItem image={PocketFidget} text="POCKET FIDGET" size="h-64" url="/shop/fidget" /> */}
      </div>
    </div>
  );
};

export default Figure;
