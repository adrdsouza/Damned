'use client';

import { useState, useEffect } from 'react';
import PocketItem from '../../card/card';
import GridPagenation, {
  Sorting,
} from '@/components/pagenation/gridpagenation';
import Pagenation from '@/components/pagenation/page';

const ProductsList = ({
  data,
  showPagination,
}: {
  data: any;
  showPagination?: Boolean | undefined;
}) => {
  const [page, setPage] = useState<number>(1);
  const [count, setCount] = useState<number>(0);
  const [sort, setSort] = useState<number>(0);

  const prePage = () => {
    page > 1 && setPage(page - 1);
  };

  const afterPage = () => {
    data.length > page * 12 && setPage(page + 1);
  };

  useEffect(() => {
    if (data)
      if (data.length > page * 12) setCount(12);
      else if (page > 1) setCount(data.length - (page - 1) * 12);
      else setCount(data.length);
  }, [page]);

  return (
    <div className={`grid justify-items-between`}>
      {showPagination === true ? (
        <GridPagenation
          count={count}
          total={data && data.length}
          onSort={setSort}
        />
      ) : null}

      <div className='lg:mt-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
        {Sorting(sort, data).map(
          (p: any, index) =>
            12 * (page - 1) <= index &&
            index < 12 * page && (
              <PocketItem
                key={index}
                img={p.image && p.image.sourceUrl}
                productId={p.id}
                name={p.name}
                price={p.price}
                slug={p.slug}
                onSale={false}
                stockStatus={p.stockStatus === 'OUT_OF_STOCK' ? false : true}
              />
            )
        )}
      </div>
      {showPagination ? (
        <Pagenation
          className='lg:mt-8'
          page={page}
          prePage={prePage}
          afterPage={afterPage}
        />
      ) : null}
    </div>
  );
};

export default ProductsList;
