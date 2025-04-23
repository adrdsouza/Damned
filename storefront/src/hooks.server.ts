import type { Handle } from '@sveltejs/kit';


// Extend the Locals interface to include countryCode
declare global {
  namespace App {
    interface Locals {
      countryCode?: string;

      PUBLIC_MEDUSA_PUBLISHABLE_KEY: string;
    }
  }
}

import { PUBLIC_MEDUSA_PUBLISHABLE_KEY } from '$env/dynamic/public';


/**
 * SvelteKit server hooks to handle route transformations:
 * 1. Country prefix routing: Detects country code prefixes in URLs (like /us/, /ca/)
 *    and rewrites them to standard routes
 * 2. Product route normalization: Converts singular '/product/' routes to plural '/products/'
 *    to match the application's actual route structure
 */
export const handle: Handle = async ({ event, resolve }) => {
  const url = new URL(event.request.url);
  const pathname = url.pathname;
  event.locals.PUBLIC_MEDUSA_PUBLISHABLE_KEY = PUBLIC_MEDUSA_PUBLISHABLE_KEY;




  event.locals.PUBLIC_MEDUSA_PUBLISHABLE_KEY = $env.PUBLIC_MEDUSA_PUBLISHABLE_KEY;
  
  // Regular expression to match country code prefixes like /us/, /ca/, etc.
  // This matches a path that starts with a slash, followed by 2 letters, followed by another slash
  const countryPrefixRegex = /^\/([a-z]{2})(\/.*)/i;
  const match = pathname.match(countryPrefixRegex);
  
  if (match) {
    const countryCode = match[1]; // e.g., "us"
    const restOfPath = match[2];  // e.g., "/products/cerberusfixed"
    
    // Store the country code in the event locals for potential future use
    event.locals.countryCode = countryCode;
    
    // Rewrite the URL by updating the pathname without the country prefix
    url.pathname = restOfPath;
    event.request = new Request(url.toString(), event.request);
    
    console.log(`[Country Route] Rewrote ${pathname} to ${restOfPath} (country: ${countryCode})`);
  }
  
  // Get the current pathname (after any country prefix handling)
  const currentPathname = new URL(event.request.url).pathname;
  
  // Regular expression to match singular product routes like /product/[slug]
  const singularProductRegex = /^\/product\/([^\/]+)\/?$/;
  const singularMatch = currentPathname.match(singularProductRegex);
  
  if (singularMatch) {
    const productSlug = singularMatch[1]; // e.g., "chimera"
    const pluralPath = `/products/${productSlug}`;
    
    // Rewrite the URL to use the plural form
    const newUrl = new URL(event.request.url);
    newUrl.pathname = pluralPath;
    event.request = new Request(newUrl.toString(), event.request);
    
    console.log(`[Product Route] Rewrote ${currentPathname} to ${pluralPath} (singular to plural)`);
  }
  
  return resolve(event);
};