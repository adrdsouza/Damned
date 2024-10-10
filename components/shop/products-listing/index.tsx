'use client';

import { useEffect, useRef, useState } from 'react';
import PocketItem from '../../card/card';
import Pagination from '@mui/material/Pagination';
import { Node, ProductUnion, VariableProduct } from '@/graphql';
import { text } from '@/app/styles';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const ProductsList = ({
  data,
  showPagination,
  title,
}: {
  data: VariableProduct[];
  showPagination?: Boolean | undefined;
  title: string;
}) => {
  //const cols = data.length >= 4 ? 4 : data.length;

  const pathname = usePathname();
  const [sort, setSort] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  const pageCount = Math.ceil(data.length / itemsPerPage);

  const handlePageChange = (event: any, page: number) => {
    setCurrentPage(page);
  };

  const paginatedData = data.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [data]);

  return (
    <div className='w-full'>
      <div className='my-4 flex-col sm:flex-row justify-between items-center'>
        <div className='flex gap-2'>
          <Link href={'/'}>Home</Link>
          <p>/</p>
          <p>{title}</p>
        </div>

        {showPagination === true ? (
          <div className='flex gap-2 items-center'>
            <p>Sort By</p>
            <Select
              size='small'
              value={sort}
              onChange={(e) => {
                setSort(e.target.value);
              }}
            >
              <MenuItem value={0}>
                <Link scroll={false} href={`${pathname}?field=&order=`}>
                  Default
                </Link>
              </MenuItem>
              <MenuItem value={1}>
                <Link scroll={false} href={`${pathname}?field=PRICE&order=ASC`}>
                  Price (Low - High)
                </Link>
              </MenuItem>
              <MenuItem value={2}>
                <Link
                  scroll={false}
                  href={`${pathname}?field=PRICE&order=DESC`}
                >
                  Price (High - Low)
                </Link>
              </MenuItem>
            </Select>
          </div>
        ) : null}
      </div>

      <div
        className={`lg:mt-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2`}
      >
        {paginatedData.map((p) => (
          <PocketItem
            key={p?.id}
            img={p?.image && p.image.sourceUrl}
            productId={p?.id}
            name={p?.name ?? ''}
            price={p?.price ?? ''}
            slug={p?.slug ?? ''}
            onSale={false}
            stockStatus={p.stockStatus === 'OUT_OF_STOCK' ? false : true}
          />
        ))}
      </div>

      {/* Show pagination only if the data length is greater than 5 */}
      {showPagination && data.length > 9 && (
        <div className='flex justify-center mt-4'>
          <Pagination
            count={pageCount}
            page={currentPage}
            onChange={handlePageChange}
            color='standard'
          />
        </div>
      )}
    </div>
  );
};

export default ProductsList;
