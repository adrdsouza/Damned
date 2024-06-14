'use client';

import GridPagenation, {
  Sorting,
} from '@/components/pagenation/gridpagenation';
import EdcItem from '@/components/card/card';
import { Product } from '@/lib/graphql/type';
import { useState } from 'react';

interface EdcProps {
  className?: string;
  data: Product[];
}

const Edc: React.FC<EdcProps> = (props) => {
  const [sort, setSort] = useState<number>(0);

  return (
    <div className='w-full px-[30px] py-[2em]  2xl:w-[1440px] m-auto '>
      <div
        className={`${
          props.className && props.className
        } grid justify-items-center`}
      >
        <GridPagenation
          total={props.data && props.data.length}
          onSort={setSort}
        />
        <div className='lg:mt-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5'>
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
  );
};

export default Edc;
