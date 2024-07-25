'use client';

import { text } from '@/app/styles';
import { Product } from '@/lib/graphql/type';

function extractMinPrice(priceStr) {
  // Remove the dollar sign and split by hyphen
  const prices = priceStr.replace('$', '').split(' - ');
  // Convert to numbers and return the minimum value
  return parseFloat(prices[0]);
}

export const Sorting = (sorttype: number, data: any) => {
  switch (sorttype.toString()) {
    // case '1':
    //   return data.sort((a, b) => a.node.reviewCount - b.node.reviewCount);
    case '2':
      return data.sort(
        (a, b) =>
          new Date(b.image && b.image.date).getUTCDate() -
          new Date(a.image && a.image.date).getUTCDate()
      );
    case '3':
      return data.sort(
        (a, b) => extractMinPrice(a.price) - extractMinPrice(b.price)
      );
    case '4':
      return data.sort(
        (a, b) => extractMinPrice(b.price) - extractMinPrice(a.price)
      );
    case '0':
    default:
      return data.sort((a, b) =>
        a.name.toLowerCase().localeCompare(b.name.toLowerCase())
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
    <div className={`${props.className} w-full flex mb-2 justify-between`}>
      <div className='flex items-center'>
        <p className={`${text.sm}`}>
          Showing {props.count && props.count} of {props.total && props.total}{' '}
          results
        </p>
      </div>
      <div className='flex items-center'>
        {/* <p>Setting Sorting Method</p> */}
        <select
          className={`w-full ${text.sm} py-2 px-4 rounded bg-gray-100 border-0 focus:outline-none`}
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
