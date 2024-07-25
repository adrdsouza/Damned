import { PropsWithChildren } from 'react';
import {
  useSessionManager,
  createSessionContext,
  createContextHook,
  SessionData,
} from '@woographql/react-hooks';
import { createTokenManager } from './tokenManager';
import { createSessionOperations } from './sessionOperations';

export interface Data extends SessionData {
  sendPasswordReset: (username: string) => Promise<boolean>;
  updatePaymentMethod: (
    mutation: 'set-default' | 'delete',
    tokenId: number
  ) => Promise<'SUCCESS' | 'FAILED'>;
}

export const sessionContext = createSessionContext<Data>();

export const useSession = createContextHook<Data>(sessionContext);

export const tokenManager = createTokenManager();

const operations = createSessionOperations(tokenManager);

export function SessionProvider({ children }: PropsWithChildren) {
  const store = useSessionManager<Data>(tokenManager, operations, {
    startOnMount: true,
    initialState: {},
  });

  const { Provider } = sessionContext;
  return <Provider value={store}>{children}</Provider>;
}
