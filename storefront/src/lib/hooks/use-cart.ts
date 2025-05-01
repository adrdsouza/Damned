import { useQuery } from "@tanstack/react-query"
import { sdk } from "../config"
import { queryKeys } from "../query-keys"

/**
 * Hook to fetch the current cart using the Medusa JS SDK.
 * Retrieves the cart associated with the current session.
 */
export function useCart() {
  const { data, ...rest } = useQuery({
    queryKey: queryKeys.cart(), // Uses ["cart"]
    queryFn: async () => sdk.store.carts.retrieveCurrent(),
    // Keep data fresh for a short period to avoid rapid refetches
    staleTime: 1000 * 60 * 1, // 1 minute
    // Refetch when the window gains focus, component mounts, or network reconnects
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    refetchOnReconnect: true,
  })

  // Return the cart object directly and the rest of the query state
  return { cart: data?.cart, ...rest }
}