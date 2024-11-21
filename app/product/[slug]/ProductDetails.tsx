'use client';

import { useEffect, useRef, useState } from 'react';
import { text } from '@/app/styles';
import {
  Button,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  TextField,
} from '@mui/material';
import { useCartMutations } from '@woographql/react-hooks';
import { sessionContext, useSession } from '@/client/SessionProvider';
import toast from 'react-hot-toast';
import { LoadingButton } from '@mui/lab';
import { clearLocalStorage, reloadBrowser } from '@/components/utils';
import { addToWaitlist } from '@/lib/graphql';

const ProductDetails = ({ product }: any) => {
  console.log(product);
  const [waitlist, setWaitlist] = useState('');
  const [selectedVariation, setSelectedVariation] = useState<any>(null);
  const [executing, setExecuting] = useState<any>(false);

  const productId = product.databaseId as number;
  const variationId = (selectedVariation?.databaseId as number) ?? undefined;

  const { fetching, mutate, quantityFound } = useCartMutations(
    {
      productId,
      variationId,
    },
    sessionContext
  );
  const timeoutRef = useRef<any>(null);
  const { cart, customer } = useSession();

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
        toast.error('Add to cart failed');
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
        console.log(error);
        toast.error('Cart session expired.');
        reloadBrowser();
      }
    }
    setExecuting(false);
  };

  const handleWaitlist = async (e) => {
    e.preventDefault();
    let email;
    if (customer?.id !== 'guest') {
      email = customer?.email;
    } else {
      email = waitlist;
    }
    const res = await addToWaitlist(variationId, email);
    if (res) {
      toast.success(res);
    } else {
      toast.error('Error while adding user to waitlist.');
    }
    setWaitlist('');
  };

  useEffect(() => {
    const startTimeout = () => {
      timeoutRef.current = setTimeout(() => {
        if (fetching === false && cart === null) {
          toast.loading('Loading Cart Session');
          reloadBrowser();
        }
      }, 3000); // 4 seconds timeout
    };

    if (fetching === false && cart === null) {
      startTimeout();
    } else {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;

      if (fetching === false && cart !== null) {
        // Fetching is false and cart is not null, no need to create a new timeout
        return;
      }
      if (fetching !== false) {
        // Fetching changed, start a new timeout
        startTimeout();
      }
    }

    return () => clearTimeout(timeoutRef.current); // Cleanup on unmount
  }, [fetching, cart]);

  return (
    <div className="flex flex-col gap-4">
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
        <form
          onSubmit={handleWaitlist}
          className=" flex flex-col gap-4 items-start"
        >
          <p>Sold Out!</p>
          <p>
            Join the waitlist to be emailed when this product becomes available
          </p>
          {customer?.id === 'guest' ? (
            <TextField
              value={waitlist}
              onChange={(e) => setWaitlist(e.target.value)}
              type="email"
              required
              size="small"
            />
          ) : null}
          <Button
            type="submit"
            className="py-2 px-8 bg-stone-400 w-fit text-white hover:bg-stone-600"
          >
            ADD TO WAITLIST
          </Button>
        </form>
      ) : null}

      <LoadingButton
        onClick={addToCart}
        loading={executing || !cart}
        disabled={cartButtonDisabled}
        className="py-2 px-8 bg-stone-400 w-fit text-white hover:bg-stone-600"
      >
        ADD TO CART
      </LoadingButton>

      <div dangerouslySetInnerHTML={{ __html: product.description }} />
    </div>
  );
};

export default ProductDetails;
