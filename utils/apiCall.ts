import { isDev } from '@/utils/dev';

type ResponseErrors = {
  errors?: {
    message: string;
    data?: unknown;
  };
};

export async function apiCall<T>(url: string, input: globalThis.RequestInit) {
  // Fetch data.

  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    ...input,
  });

  // Throw if not successful.
  if (response.status !== 200) {
    const { errors = {} } = await response.json();
    console.log(errors?.message || response.statusText);
    throw new Error(errors?.message || `Failed to fetch: /api/${url}`);
  }

  // Decode response.
  const json: T & ResponseErrors = await response.json();

  return json;
}

export function flattenObjectToParams(obj: any, parentKey = '') {
  const params = new URLSearchParams();

  for (const key in obj) {
    const value = obj[key];
    const fullKey = parentKey ? `${parentKey}[${key}]` : key;

    if (typeof value === 'object' && value !== null) {
      const nestedParams = flattenObjectToParams(value, fullKey);
      nestedParams.forEach((nestedValue, nestedKey) => {
        params.append(nestedKey, nestedValue);
      });
    } else if (Array.isArray(value)) {
      value.forEach((element, index) => {
        params.append(`${fullKey}[${index}]`, element);
      });
    } else {
      params.append(fullKey, value);
    }
  }

  return params;
}
