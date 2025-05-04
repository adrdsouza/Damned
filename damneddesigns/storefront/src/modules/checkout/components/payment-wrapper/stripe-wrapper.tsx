"use client"

import { HttpTypes } from "@medusajs/types"

type PaymentWrapperProps = {
  paymentSession: HttpTypes.StorePaymentSession
  children: React.ReactNode
}

const PaymentWrapper: React.FC<PaymentWrapperProps> = ({
  paymentSession,
  children,
}) => {
  return <>{children}</>
}

export default PaymentWrapper
