"use client"

import React, { ErrorInfo, useState } from "react"
import { HttpTypes } from "@medusajs/types"
import { Text, Button } from "@medusajs/ui"

type PaymentWrapperProps = {
  cart: HttpTypes.StoreCart
  children: React.ReactNode
}

// Custom error boundary component
class ErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode; fallback: React.ReactNode }) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(_: Error) {
    return { hasError: true }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Payment component error:", error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback
    }
    return this.props.children
  }
}

// Enhanced payment wrapper with error handling
const PaymentWrapper: React.FC<PaymentWrapperProps> = ({ cart, children }) => {
  const [key, setKey] = useState(0)
  
  // Error fallback component
  const ErrorFallback = () => (
    <div className="p-4 border border-red-300 bg-red-50 rounded-md">
      <Text className="text-red-600 mb-2">
        There was an error loading the payment options.
      </Text>
      <Button 
        variant="secondary" 
        size="small"
        onClick={() => setKey(prev => prev + 1)}
      >
        Try Again
      </Button>
    </div>
  )

  return (
    <div>
      <ErrorBoundary key={key} fallback={<ErrorFallback />}>
        <React.Suspense fallback={<div className="p-4">Loading payment options...</div>}>
          {children}
        </React.Suspense>
      </ErrorBoundary>
    </div>
  )
}

export default PaymentWrapper
