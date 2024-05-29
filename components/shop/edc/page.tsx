"use client";

import GridPagenation, {
  Sorting,
} from "@/components/pagenation/gridpagenation";
import EdcItem from "@/components/card/card";
import { Product } from "@/lib/graphql/type";
import { useState } from "react";

interface EdcProps {
  className?: string;
  data: Product[];
}

const Edc: React.FC<EdcProps> = (props) => {
  const [sort, setSort] = useState<number>(0);

  return (
    <div className="flex">
      <div className="w-1/4 flex flex-col justify-center items-center">
        
      </div>
      <div className="w-3/4 bg-white">
        <div
          className={`${
            props.className && props.className
          } grid justify-items-center`}
        >
          <GridPagenation
            total={props.data && props.data.length}
            onSort={setSort}
          />
          <div className="lg:mt-2 grid grid-cols-3 gap-10">
            {props.data &&
              Sorting(sort, props.data).map((p, index) => (
                <EdcItem
                  img={p.node.image && p.node.image.sourceUrl}
                  productId={p.node.id}
                  name={p.node.name}
                  price={p.node.price}
                  onSale={p.node.onSale}
                  key={index}
                />
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Edc;
