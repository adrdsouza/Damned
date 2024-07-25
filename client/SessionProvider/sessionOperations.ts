import { createUrlGenerator } from '@woographql/session-utils';
import type { TokenManager } from '@woographql/session-utils';
import type {
  SessionOperations,
  Customer,
  Cart,
} from '@woographql/react-hooks';

import { apiCall } from '@/utils/apiCall';
import { PaymentTokenCC, Customer as CustomerType } from '@/graphql';

type LoginResponse = {
  authToken: string;
  refreshToken: string;

  sessionToken: string;
  customer: Customer;
  cart: Cart;
};

type FetchSessionResponse = {
  cart: Cart;
  customer: Customer;
  sessionToken: string;
};

type FetchCartResponse = {
  cart: Cart;
  sessionToken: string;
};

type FetchCustomerResponse = {
  customer: Customer;
  sessionToken: string;
};

type SuccessResponse = {
  success: boolean;
};
const generateUrl = createUrlGenerator(
  process.env.BACKEND_URL as string,
  'transfer-session'
);

export function createSessionOperations(
  tokenManager: TokenManager
): SessionOperations {
  return {
    fetchSessionData: (state, dispatch) => async () => {
      const tokens = tokenManager.getTokens();
      const { sessionToken, cart, customer } =
        await apiCall<FetchSessionResponse>('/api/session', {
          method: 'POST',
          body: JSON.stringify({
            sessionToken: tokens?.sessionToken,
            authToken: tokens?.authToken,
          }),
          cache: 'no-store',
        });

      tokenManager.saveTokens({ sessionToken });
      const clientSessionId = tokenManager.getClientSessionId();

      dispatch({
        type: 'UPDATE_STATE',
        payload: {
          cart,
          customer,
        },
      });

      return { cart, customer };
    },
    updateCart: (state, dispatch) => async (input) => {
      const tokens = tokenManager.getTokens();
      const { sessionToken, cart } = await apiCall<FetchCartResponse>(
        '/api/cart',
        {
          method: 'POST',
          body: JSON.stringify({
            sessionToken: tokens?.sessionToken,
            authToken: tokens?.authToken,
            input,
          }),
          cache: 'no-store',
        }
      );

      tokenManager.saveTokens({ sessionToken });
      dispatch({ type: 'UPDATE_STATE', payload: { cart } });

      return cart;
    },
    updateCustomer: (state, dispatch) => async (input) => {
      const tokens = tokenManager.getTokens();
      const { sessionToken, customer } = await apiCall<FetchCustomerResponse>(
        '/api/customer',
        {
          method: 'POST',
          body: JSON.stringify({
            sessionToken: tokens?.sessionToken,
            authToken: tokens?.authToken,
            input,
          }),
          cache: 'no-store',
        }
      );

      tokenManager.saveTokens({ sessionToken });
      dispatch({ type: 'UPDATE_STATE', payload: { customer } });

      return customer;
    },
    login: (state, dispatch) => async (input) => {
      const tokens = tokenManager.getTokens();
      const body = { ...input } as unknown & { sessionToken?: string };

      // If
      const itemCount = state.cart?.contents?.itemCount;
      console.log({ state });
      if (itemCount && itemCount > 0) {
        body.sessionToken = tokens.sessionToken;
        console.log(body);
      }

      try {
        const { sessionToken, authToken, refreshToken, customer, cart } =
          await apiCall<LoginResponse>('/api/login', {
            method: 'POST',
            body: JSON.stringify(body),
            next: { revalidate: 10 },
          });

        tokenManager.saveTokens({ sessionToken, authToken, refreshToken });
        dispatch({
          type: 'UPDATE_STATE',
          payload: {
            customer,
            cart,
          },
        });

        return customer;
      } catch (err) {
        dispatch({
          type: 'UPDATE_STATE',
          payload: { fetching: false },
        });
        return (err as Error).message as any;
      }
    },
    logout: (state, dispatch) => async () => {
      const itemCount = state.cart?.contents?.itemCount;
      if (!itemCount || itemCount === 0) {
        return;
      }
      const tokens = tokenManager.getTokens();
      await apiCall<FetchCartResponse>('/api/cart', {
        method: 'POST',
        body: JSON.stringify({
          sessionToken: tokens?.sessionToken,
          authToken: tokens?.authToken,
          input: {
            mutation: 'emptyCart',
            input: { clearPersistentCart: true },
          },
        }),
        cache: 'no-store',
      });
    },
    sendPasswordReset: (state, dispatch) => async (username) => {
      const { success } = await apiCall<SuccessResponse>('/api/send-reset', {
        method: 'POST',
        body: JSON.stringify({ username }),
        cache: 'no-cache',
      });

      return success;
    },
  };
}
