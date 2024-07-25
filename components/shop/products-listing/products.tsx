'use client';

import { useState, useEffect } from 'react';
import { fetchProducts } from '@/graphql';
import ProductsList from './index';
import { init } from '@graphql-codegen/cli';
import { CircularProgress } from '@mui/material';

const Products = ({
  id,
  showPagination,
}: {
  id: number;
  showPagination?: Boolean | undefined;
}) => {
  const [products, setProducts] = useState<any>(null);

  const fetchData = async (id: number) => {
    const { nodes: initialProducts } = await fetchProducts({
      first: 30,
      where: { categoryId: id },
    });
    if (initialProducts) {
      setProducts(initialProducts);
    }
  };

  useEffect(() => {
    if (!products) {
      fetchData(id);
    }
  }, []);

  return (
    <>
      {products ? (
        <ProductsList data={products} showPagination={showPagination} />
      ) : (
        <div className='flex w-full items-center justify-center'>
          <div className='flex w-fit items-center gap-2'>
            <CircularProgress color='inherit' />
            <p>Loading</p>
          </div>
        </div>
      )}
    </>
  );
};

export default Products;
