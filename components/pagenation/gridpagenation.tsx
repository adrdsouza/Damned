'use client';

import { Product } from '@/lib/graphql/type';

export const Sorting = (sorttype: number, data: Product[]): Product[] => {
  switch (sorttype.toString()) {
    case '1':
      return data.sort((a, b) => a.node.reviewCount - b.node.reviewCount);
    case '2':
      return data.sort(
        (a, b) =>
          new Date(b.node.image && b.node.image.date).getUTCDate() -
          new Date(a.node.image && a.node.image.date).getUTCDate()
      );
    case '3':
      return data.sort((a, b) => a.node.price - b.node.price);
    case '4':
      return data.sort((a, b) => b.node.price - a.node.price);
    case '0':
    default:
      return data.sort((a, b) =>
        a.node.name.toLowerCase().localeCompare(b.node.name.toLowerCase())
      );
  }
};
interface GridPagenation {
  className?: string;
  count?: number;
  total?: number;
  onSort?: any;
}

const GridPagenation: React.FC<GridPagenation> = (props) => {
  const handleSort = (e: any) => {
    props.onSort && props.onSort(e.target.value);
  };

  return (
    <div className={`${props.className} w-full flex justify-between lg:px-10`}>
      <div className='flex items-center'>
        <p className='lg:ml-4 sm:ml-2'>
          Showing {props.count && props.count} of {props.total && props.total}{' '}
          results
        </p>
      </div>
      <div className='flex items-center'>
        <p>Setting Sorting Method</p>
        <select
          className='w-full  lg:ml-4 px-10 py-2 bg-gray-100 border-0 focus:outline-none'
          name=''
          id=''
          onChange={(e) => handleSort(e)}
        >
          <option value='0'>Default sorting</option>
          <option value='1'>Sort by popularity</option>
          <option value='2'>Sort by latest</option>
          <option value='3'>Sort by price(low price)</option>
          <option value='4'>Sort by price(high price)</option>
        </select>
      </div>
    </div>
  );
};

export default GridPagenation;
