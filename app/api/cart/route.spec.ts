/**
 * @jest-environment node
 */
import type { RequestMethod } from 'node-mocks-http';
import { getClient } from '@/graphql';
import { POST } from './route';
import { GraphQLClient } from 'graphql-request';

jest.mock('graphql', () => ({
  print: jest.fn(() => 'print'),
}));
jest.mock('@/graphql', () => ({
  getClient: jest.fn(),
}));

const mockGetClient = getClient as jest.MockedFunction<typeof getClient>;

describe('/api/cart API Endpoint', () => {
  process.env.GRAPHQL_ENDPOINT = 'http://localhost/graphql';
  const mockRequest = (method: RequestMethod = 'POST', body?: unknown) => {
    const request = new Request('http://localhost/api/cart', {
      method,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: body ? JSON.stringify(body) : undefined,
    });
    return { request };
  };

  it('should return a 500 error from a POST request when no session token provided', async () => {
    const { request } = mockRequest('POST', {});

    const response = await POST(request);
    expect(response.status).toBe(500);
    expect(response.ok).toBeFalsy();

    const json = await response.json();
    expect(json.errors.message).toBe('Session not started');
  });

  it('should return a 500 error from a POST request when no input provided', async () => {
    const { request } = mockRequest('POST', { sessionToken: 'sessionToken' });

    mockGetClient.mockImplementationOnce(() => ({
      setHeaders: jest.fn(),
    } as unknown as GraphQLClient));

    const response = await POST(request);
    expect(response.status).toBe(500);
    expect(response.ok).toBeFalsy();

    const json = await response.json();
    expect(json.errors.message).toBe('No input provided');
  });

  it('should return a 500 error from a POST request when no mutation provided', async () => {
    const { request } = mockRequest('POST', { sessionToken: 'sessionToken', input: {} });

    mockGetClient.mockImplementationOnce(() => ({
      setHeaders: jest.fn(),
    } as unknown as GraphQLClient));

    const response = await POST(request);
    expect(response.status).toBe(500);
    expect(response.ok).toBeFalsy();

    const json = await response.json();
    expect(json.errors.message).toBe('No mutation provided');
  });

  it('should return a 500 error from a POST request when invalid mutation provided', async () => {
    const { request } = mockRequest('POST', { sessionToken: 'sessionToken', input: { mutation: 'invalid' } });

    mockGetClient.mockImplementationOnce(() => ({
      setHeaders: jest.fn(),
    } as unknown as GraphQLClient));

    const response = await POST(request);
    expect(response.status).toBe(500);
    expect(response.ok).toBeFalsy();

    const json = await response.json();
    expect(json.errors.message).toBe('Invalid mutation provided');
  });

  it('should return a 500 error from a POST request when no cart or session token returned from WooCommerce', async () => {
    const { request } = mockRequest('POST', {
      sessionToken: 'sessionToken',
      input: {
        mutation: 'addToCart',
      }
    });
    mockGetClient.mockImplementationOnce(() => ({
      rawRequest: jest.fn(() => ({
        data: {
          addToCart: {
            cart: null,
          },
        },
        headers: {
          get: jest.fn(() => null),
        },
      })),
      setHeaders: jest.fn(),
    } as unknown as GraphQLClient));

    const response = await POST(request);
    expect(response.status).toBe(500);
    expect(response.ok).toBeFalsy();

    const json = await response.json();
    expect(json.errors.message).toBe('No cart or session token returned from WooCommerce');
  });

  it('should return a 200 response from a POST request when valid mutation and session token provided', async () => {
    const { request } = mockRequest('POST', {
      sessionToken: 'sessionToken',
      input: { 
        mutation: 'addToCart',
        input: { productId: 1, quantity: 1 }
      }
    });
    mockGetClient.mockImplementationOnce(() => ({
      rawRequest: jest.fn(() => ({
        data: {
          addToCart: {
            cart: {},
          },
        },
        headers: {
          get: jest.fn(() => 'sessionToken'),
        },
      })),
      setHeaders: jest.fn(),
    } as unknown as GraphQLClient));

    const response = await POST(request);
    expect(response.status).toBe(200);
    expect(response.ok).toBeTruthy();

    const json = await response.json();
    expect(json.sessionToken).toBe('sessionToken');
    expect(json.cart).toEqual({});
    expect(json.errors).toBeUndefined();
  });

  it('should return a 500 error from a POST request when an error occurs', async () => {
    const { request } = mockRequest('POST', {
      sessionToken: 'sessionToken',
      input: {
        mutation: 'addToCart',
        input: {},
      }
    });
    mockGetClient.mockImplementationOnce(() => {
      throw new Error('Test error');
    });

    const response = await POST(request);
    expect(response.status).toBe(500);
    expect(response.ok).toBeFalsy();

    const json = await response.json();
    expect(json.errors.message).toBe('Sorry, something went wrong');
  });

  it('should handle "update" mutation correctly', async () => {
    const { request } = mockRequest('POST', {
      sessionToken: 'sessionToken',
      input: {
        mutation: 'updateItemQuantities',
        input: {},
      }
    });
    mockGetClient.mockImplementationOnce(() => ({
      rawRequest: jest.fn(() => ({
        data: {
          updateItemQuantities: {
            cart: {},
          },
        },
        headers: {
          get: jest.fn(() => 'sessionToken'),
        },
      })),
      setHeaders: jest.fn(),
    } as unknown as GraphQLClient));
  
    const response = await POST(request);
    expect(response.status).toBe(200);
    expect(response.ok).toBeTruthy();
  
    const json = await response.json();
    expect(json.sessionToken).toBe('sessionToken');
    expect(json.cart).toEqual({});
    expect(json.errors).toBeUndefined();
  });
  
  it('should handle "remove" mutation correctly', async () => {
    const { request } = mockRequest('POST', {
      sessionToken: 'sessionToken',
      input: {
        mutation: 'removeItemsFromCart',
        input: {}
      }
    });
    mockGetClient.mockImplementationOnce(() => ({
      rawRequest: jest.fn(() => ({
        data: {
          removeItemsFromCart: {
            cart: {},
          },
        },
        headers: {
          get: jest.fn(() => 'sessionToken'),
        },
      })),
      setHeaders: jest.fn(),
    } as unknown as GraphQLClient));
  
    const response = await POST(request);
    expect(response.status).toBe(200);
    expect(response.ok).toBeTruthy();
  
    const json = await response.json();
    expect(json.sessionToken).toBe('sessionToken');
    expect(json.cart).toEqual({});
    expect(json.errors).toBeUndefined();
  });
  
});
