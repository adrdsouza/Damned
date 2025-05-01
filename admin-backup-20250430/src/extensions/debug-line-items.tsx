import React, { useEffect, useState } from "react"
import { Button, Container, Heading, Text } from "@medusajs/ui"

/**
 * Debug component to check data structure of line items
 */
export const DebugLineItems = () => {
  const [lineItems, setLineItems] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Using direct fetch to avoid cache issues
  const fetchLineItems = async () => {
    try {
      const response = await fetch(`/api/admin/orders?limit=1`, {
        credentials: 'include'
      })
      
      if (!response.ok) {
        throw new Error(`Error fetching orders: ${response.statusText}`)
      }
      
      const data = await response.json()
      
      if (data.orders && data.orders.length > 0 && data.orders[0].items) {
        setLineItems(data.orders[0].items)
      } else {
        setLineItems([])
      }
    } catch (err) {
      console.error("Failed to fetch line items:", err)
      setError(err instanceof Error ? err.message : 'Unknown error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchLineItems()
  }, [])

  if (isLoading) {
    return <Text>Loading line item data...</Text>
  }

  if (error) {
    return <Text className="text-ui-fg-error">Error: {error}</Text>
  }

  return (
    <Container className="p-4">
      <div className="mb-4">
        <Heading level="h1">Line Item Debug</Heading>
        <Text>Examining data structure of line items</Text>
        <Button variant="secondary" className="mt-2" onClick={fetchLineItems}>
          Refresh Data
        </Button>
      </div>

      <div className="bg-ui-bg-subtle p-4 rounded-md">
        <Heading level="h2" className="mb-2">Line Items ({lineItems.length})</Heading>
        
        {lineItems.length > 0 ? (
          <div className="bg-ui-bg-base p-4 rounded-md">
            <pre className="whitespace-pre-wrap overflow-auto">
              {JSON.stringify(lineItems, null, 2)}
            </pre>
          </div>
        ) : (
          <Text>No line items found</Text>
        )}
      </div>
    </Container>
  )
}