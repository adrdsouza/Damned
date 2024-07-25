'use client';

import { useEffect, useState } from 'react';
import { text } from '@/app/styles';
import {
  Button,
  CircularProgress,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  TextField,
} from '@mui/material';
import { useCartMutations, useProduct } from '@woographql/react-hooks';
import { sessionContext, useSession } from '@/client/SessionProvider';
import { getRequiredAttributes } from './helpers';
import toast from 'react-hot-toast';
import { LoadingButton } from '@mui/lab';
import { Cart, CartItem } from '@/graphql';
import { clearLocalStorage, reloadBrowser } from '@/components/utils';

const ProductDetails = ({ product }: any) => {
  const [selectedVariation, setSelectedVariation] = useState<any>(null);
  const [executing, setExecuting] = useState<any>(false);
  // const { fetching: fetchingSessionData } = useSession();
  const productId = product.databaseId as number;
  const variationId = (selectedVariation?.databaseId as number) ?? undefined;

  const { fetching, mutate, quantityFound } = useCartMutations(
    {
      productId,
      variationId,
    },
    sessionContext
  );

  const cartButtonDisabled =
    executing ||
    selectedVariation?.stockStatus === 'OUT_OF_STOCK' ||
    !selectedVariation;

  const addToCart = async () => {
    setExecuting(true);
    try {
      if (quantityFound) {
        toast.success(`${selectedVariation.name} is already added to cart`);
        setExecuting(false);
        return;
      }
      const flag = await mutate('addToCart', {
        quantity: 1,
      });

      if (!flag) {
        clearLocalStorage();
        reloadBrowser();
        return;
      }

      toast.success(`${selectedVariation.name} is added to cart`);
    } catch (error: any) {
      console.log(error);
      if (error.message.includes('out of stock')) {
        toast.error('Product is currently out of stock.');
      } else {
        toast.error('Cart session expired.');
        reloadBrowser();
      }
    }
    setExecuting(false);
  };

  return (
    <div className='flex flex-col gap-4'>
      <div>
        <h1 className={`${text.lg} font-normal uppercase`}>{product.name}</h1>
        <p className={`${text.lg} font-normal`}>{product.price}</p>
      </div>

      <FormControl>
        <RadioGroup>
          {product.variations.nodes.map((option: any) => (
            <FormControlLabel
              key={option.id}
              sx={{ width: 'fit-content', mb: 2 }}
              onChange={() => {
                setSelectedVariation(option);
              }}
              checked={selectedVariation?.id === option.id}
              control={<Radio />}
              label={
                <div>
                  <p>{option?.attributes.nodes[0]?.value ?? ''}</p>
                  <p>{option?.price ?? ''}</p>
                </div>
              }
            />
          ))}
        </RadioGroup>
      </FormControl>

      {selectedVariation?.stockStatus === 'OUT_OF_STOCK' ? (
        <div className=' flex flex-col gap-4 items-start'>
          <p>Sold Out!</p>
          <p>
            Join the waitlist to be emailed when this product becomes available
          </p>
          <TextField type='email' size='small' />
          <Button className='py-2 px-8 bg-stone-400 w-fit text-white hover:bg-stone-600'>
            ADD TO WISHLIST
          </Button>
        </div>
      ) : null}

      <LoadingButton
        onClick={addToCart}
        loading={executing || fetching}
        disabled={cartButtonDisabled}
        className='py-2 px-8 bg-stone-400 w-fit text-white hover:bg-stone-600'
      >
        ADD TO CART
      </LoadingButton>

      <div dangerouslySetInnerHTML={{ __html: product.description }} />
    </div>
  );
};

export default ProductDetails;
