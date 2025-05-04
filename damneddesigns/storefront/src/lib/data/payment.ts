"use server"

import { sdk } from "@lib/config"
import { getAuthHeaders, getCacheOptions } from "./cookies"
import { HttpTypes } from "@medusajs/types"

export const listCartPaymentMethods = async (regionId: string) => {
  console.log("Fetching payment methods for region:", regionId);
  
  const headers = {
    ...(await getAuthHeaders()),
  }

  // Remove cache to ensure we get fresh data
  const next = {
    ...(await getCacheOptions("payment_providers")),
    revalidate: 0, // Force revalidation
  }

  try {
    const response = await sdk.client
      .fetch<HttpTypes.StorePaymentProviderListResponse>(
        `/store/payment-providers`,
        {
          method: "GET",
          query: { region_id: regionId },
          headers,
          next,
          cache: "no-store", // Don't use cache
        }
      );
    
    console.log("RAW Payment providers response:", JSON.stringify(response));
    
    if (response?.payment_providers) {
      const sorted = response.payment_providers.sort((a, b) => {
        return a.id > b.id ? 1 : -1
      });
      
      console.log("SORTED Payment providers:", JSON.stringify(sorted));
      return sorted;
    } else {
      console.error("No payment_providers in response:", response);
      return [];
    }
  } catch (error) {
    console.error("Error fetching payment providers:", error);
    return [];
  }
}
