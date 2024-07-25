import { NextResponse as BaseResponse } from 'next/server';
import { print } from 'graphql/language/printer';
import { CartAction } from '@woographql/react-hooks';

import {
  AddToCartInput,
  AddToCartMutation,
  AddToCartDocument,
  UpdateItemQuantitiesInput,
  UpdateCartItemQuantitiesMutation,
  UpdateCartItemQuantitiesDocument,
  RemoveItemsFromCartInput,
  RemoveItemsFromCartMutation,
  RemoveItemsFromCartDocument,
  ApplyCouponInput,
  ApplyCouponMutation,
  ApplyCouponDocument,
  RemoveCouponsInput,
  RemoveCouponsMutation,
  RemoveCouponsDocument,
  UpdateShippingMethodInput,
  UpdateShippingMethodMutation,
  UpdateShippingMethodDocument,
  EmptyCartMutation,
  EmptyCartDocument,
  EmptyCartInput,
  Cart,
  getClient,
} from '@/graphql';
import { isDev } from '@/utils/dev';

type RequestBody = {
  sessionToken: string;
  authToken?: string;
  input: CartAction;
}

type ResponseBody = {
  cart: Cart;
  sessionToken: string;
} | {
  errors: {
    message: string;
  };
}

const NextResponse = BaseResponse<ResponseBody>

type GraphQLRequestHeaders = {
  Authorization?: string;
  'woocommerce-session': string;
}

export async function POST(request: Request) {
  try {
    const body = await request.json() as RequestBody;

    if (!body.sessionToken) {
      return NextResponse.json({ errors: { message: 'Session not started' } }, { status: 500 });
    }

    const headers: GraphQLRequestHeaders = { 'woocommerce-session': `Session ${body.sessionToken}` };
    if (body.authToken) {
      headers.Authorization = `Bearer ${body.authToken}`;
    }
    const graphQLClient = getClient();
    graphQLClient.setHeaders(headers);

    if (!body.input) {
      return NextResponse.json({ errors: { message: 'No input provided' } }, { status: 500 });
    }

    const { mutation, ...variables } = body.input;
    if (!mutation) {
      return NextResponse.json({ errors: { message: 'No mutation provided' } }, { status: 500 });
    }

    let cart: Cart;
    let sessionToken: string|null = null;
    let results;
    switch (mutation) {
      case 'addToCart':
        results = await graphQLClient.rawRequest<AddToCartMutation>(
          print(AddToCartDocument),
          variables as { input: AddToCartInput },
        );

        cart = results.data?.addToCart?.cart as Cart;
        sessionToken = results.headers.get('woocommerce-session');
        break;
      case 'updateItemQuantities':
        results = await graphQLClient.rawRequest<UpdateCartItemQuantitiesMutation>(
          print(UpdateCartItemQuantitiesDocument),
          variables as { input: UpdateItemQuantitiesInput },
        );

        cart = results.data?.updateItemQuantities?.cart as Cart;
        sessionToken = results.headers.get('woocommerce-session') || body.sessionToken;
        break;
      case 'removeItemsFromCart':
        results = await graphQLClient.rawRequest<RemoveItemsFromCartMutation>(
          print(RemoveItemsFromCartDocument),
          variables as { input: RemoveItemsFromCartInput },
        );

        cart = results.data?.removeItemsFromCart?.cart as Cart;
        sessionToken = results.headers.get('woocommerce-session') || body.sessionToken;
        break;
      case 'applyCoupon':
        results = await graphQLClient.rawRequest<ApplyCouponMutation>(
          print(ApplyCouponDocument),
          variables as { input: ApplyCouponInput },
        );

        cart = results.data?.applyCoupon?.cart as Cart;
        sessionToken = results.headers.get('woocommerce-session') || body.sessionToken;
        break;
      case 'removeCoupons':
        results = await graphQLClient.rawRequest<RemoveCouponsMutation>(
          print(RemoveCouponsDocument),
          variables as { input: RemoveCouponsInput },
        );

        cart = results.data?.removeCoupons?.cart as Cart;
        sessionToken = results.headers.get('woocommerce-session') || body.sessionToken;
        break;
      case 'updateShippingMethod':
        results = await graphQLClient.rawRequest<UpdateShippingMethodMutation>(
          print(UpdateShippingMethodDocument),
          variables as { input: UpdateShippingMethodInput },
        );

        cart = results.data?.updateShippingMethod?.cart as Cart;
        sessionToken = results.headers.get('woocommerce-session') || body.sessionToken;
        break;
      case 'emptyCart':
        results = await graphQLClient.rawRequest<EmptyCartMutation>(
          print(EmptyCartDocument),
          variables as { input: EmptyCartInput }
        );

        cart = results.data?.emptyCart?.cart as Cart;
        sessionToken = results.headers.get('woocommerce-session') || body.sessionToken;
        break;
      default:
        return NextResponse.json({ errors: { message: 'Invalid mutation provided' } }, { status: 500 });
    }

    if (!cart || !sessionToken) {
      const message = 'No cart or session token returned from WooCommerce';
      return NextResponse.json({ errors: { message } }, { status: 500 });
    }

    return NextResponse.json({ cart, sessionToken });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ errors: { message: 'Sorry, something went wrong' } }, { status: 500 });
  }
}