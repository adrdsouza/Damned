
import PocketKnives from "@/public/assets/images/pocket-knives.png";
import PocketBlades from "@/public/assets/images/pocket-blades.png";
import PocketSidekick from "@/public/assets/images/pocket-sidekick.png";
import PocketArt from "@/public/assets/images/pocket-art.jpeg";
import PocketApparel from "@/public/assets/images/pocket-apparel.png";
import PocketFidget from "@/public/assets/images/pocket-pidget.jpg";

import FigureItem from "@/components/figureItem";

const Shop: React.FC = () => {
  return (
    <>
      <div className="px-20 py-10 grid grid-flow-row-dense grid-cols-3 grid-rows-3 gap-5">        
        <FigureItem className="row-start-1 row-span-3" image="https://damnedventures.com/wp-content/uploads/DSC_3388-01.jpeg" text="OSIRIS CHEF KNIVES" url="/shop/osiris-chef-knives" />
        <FigureItem image="https://damnedventures.com/wp-content/uploads/77776-01.png" text="POCKET KNIVES" size="h-64" url="/shop/pocket-knives" />
        <FigureItem image="https://damnedventures.com/wp-content/uploads/DSC_0054-02.jpeg" text="POCKET ART" size="h-64" url="/shop/edc" />
        <FigureItem image="https://damnedventures.com/wp-content/uploads/IMG_9932.png" text="FIXED BLADES" size="h-64" url="/shop/fixed-blade-knives" />
        <FigureItem image="https://damnedventures.com/wp-content/uploads/IMG_3284.png" text="APPAREL" size="h-64" url="/" />
        <FigureItem image="https://damnedventures.com/wp-content/uploads/IMG_23fh38.png" text="SIDEKICK PRY BARS" size="h-64" url="/shop/sidekick-pry-bars" />
        <FigureItem image="https://damnedventures.com/wp-content/uploads/DSCF7042-scaled.jpg" text="POCKET FIDGET" size="h-64" url="/shop/fidget" />
      </div>
    </>
  );
};

export default Shop;