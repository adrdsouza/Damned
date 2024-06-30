import {
  TokenManagerWithBrowserStorage as TokenManager,
  SessionBehavior,
} from '@woographql/session-utils';
import { apiCall } from '@/utils/apiCall';

type FetchSessionTokenResponse = {
  sessionToken: string;
};
type FetchAuthTokenResponse = {
  authToken: string;
  sessionToken: string;
};

type UpdateSessionResponse = {
  sessionToken: string;
};

export function createTokenManager() {
  return new TokenManager({
    ID: `${process.env.SITE_NAME}-session`,
    behavior: [SessionBehavior.withAuth],

    startSession: async ({ authToken }) => {
      let sessionToken = '';
      let response: FetchSessionTokenResponse;
      if (authToken) {
        response = await apiCall<FetchSessionTokenResponse>('/api/auth', {
          method: 'POST',
          body: JSON.stringify({ authToken }),
          cache: 'no-store',
        });
      } else {
        response = await apiCall<FetchSessionTokenResponse>('/api/auth', {
          method: 'GET',
        });
      }

      sessionToken = response.sessionToken;

      return sessionToken;
    },
    updateSession: async (tokens, input) => {
      const { sessionToken } = await apiCall<UpdateSessionResponse>(
        '/api/session',
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

      return sessionToken;
    },
    refreshAuthToken: async (refreshToken) => {
      const { authToken } = await apiCall<FetchAuthTokenResponse>('/api/auth', {
        method: 'POST',
        body: JSON.stringify({ refreshToken }),
        cache: 'no-store',
      });

      return authToken;
    },
  });
}
