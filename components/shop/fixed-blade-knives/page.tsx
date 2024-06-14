'use client';

import { useState, useEffect } from 'react';

import PocketItem from '../../card/card';
import GridPagenation, {
  Sorting,
} from '@/components/pagenation/gridpagenation';
import Pagenation from '@/components/pagenation/page';
import { Product } from '@/lib/graphql/type';

interface FixedBladeKnivesProps {
  className?: string;
  data: Product[];
}

const FixedBladeKnives: React.FC<FixedBladeKnivesProps> = (props) => {
  const [page, setPage] = useState<number>(1);
  const [count, setCount] = useState<number>(0);
  const [sort, setSort] = useState<number>(0);

  const prePage = () => {
    page > 1 && setPage(page - 1);
  };

  const afterPage = () => {
    props.data.length > page * 12 && setPage(page + 1);
  };

  useEffect(() => {
    if (props.data)
      if (props.data.length > page * 12) setCount(12);
      else if (page > 1) setCount(props.data.length - (page - 1) * 12);
      else setCount(props.data.length);
  }, [page]);

  return (
    <div className={`${props.className} grid justify-items-between py-5`}>
      <GridPagenation
        count={count}
        total={props.data && props.data.length}
        onSort={setSort}
      />
      <div className='lg:mt-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5'>
        {Sorting(sort, props.data).map(
          (p, index) =>
            12 * (page - 1) <= index &&
            index < 12 * page && (
              <PocketItem
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
      <Pagenation
        className='lg:mt-8'
        page={page}
        prePage={prePage}
        afterPage={afterPage}
      />
    </div>
  );
};

export default FixedBladeKnives;
