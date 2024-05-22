"use client";

import GridPagenation from "@/components/pagenation/gridpagenation";
import EdcItem from "@/components/card/card";
// import Pagenation from "@/components/pagenation/page";
import { Product } from "@/lib/graphql/type";

interface EdcProps {
  className?: string;
  data: Product[];
}

const Edc: React.FC<EdcProps> = (props) => {
  
  return (
    <div className="flex">
      <div className="w-1/4 overflow-hidden"></div>
      <div className="w-3/4 bg-white">
        <div
          className={`${
            props.className && props.className
          } grid justify-items-center py-10`}
        >
          <GridPagenation total={props.data && props.data.length} />
          <div className="lg:mt-10 grid grid-cols-3 gap-5 px-20">
            {props.data &&
              props.data.map(
                (p, index) => (
                    <EdcItem
                      img={p.node.image && p.node.image.sourceUrl}
                      productId={p.node.id}
                      name={p.node.name}
                      price={p.node.price}
                      onSale={p.node.onSale}
                      key={index}
                    />
                  )
              )}
          </div>          
        </div>
      </div>
    </div>
  );
};

export default Edc;
