import PocketOsiris from "@/assets/images/pocket-osiris.jpeg";
import PocketKnives from "@/assets/images/pocket-knives.png";
import PocketBlades from "@/assets/images/pocket-blades.png";
import PocketSidekick from "@/assets/images/pocket-sidekick.png";
import PocketArt from "@/assets/images/pocket-art.jpeg";
import PocketApparel from "@/assets/images/pocket-apparel.png";
import PocketFidget from "@/assets/images/pocket-pidget.jpg";

import FigureItem from "./figureItem";

interface FigureProps {
  className?: string;
}

const Figure: React.FC<FigureProps> = (props) => {
  return (
    <div className={`${props.className}`}>
      <div className="px-20 grid grid-flow-row-dense grid-cols-3 grid-rows-3 gap-5">        
        <FigureItem className="row-start-1 row-span-3" image={PocketOsiris} text="OSIRIS CHEF KNIVES" />
        <FigureItem image={PocketKnives} text="POCKET KNIVES" size="h-64" />
        <FigureItem image={PocketBlades} text="FIXED BLADES" size="h-64" />
        <FigureItem image={PocketSidekick} text="SIDEKICK PRY BARS" size="h-64" />
        <FigureItem image={PocketArt} text="POCKET ART" size="h-64" />
        <FigureItem image={PocketApparel} text="APPAREL" size="h-64" />
        <FigureItem image={PocketFidget} text="POCKET FIDGET" size="h-64" />
      </div>
    </div>
  );
};

export default Figure;
