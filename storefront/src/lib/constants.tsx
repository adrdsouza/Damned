import React from "react"
import { CreditCard } from "@medusajs/icons"
import PayPal from "@modules/common/icons/paypal"

/* Map of payment provider_id to their title and icon. Add in any payment providers you want to use. */
export const paymentInfoMap: Record<
  string,
  { title: string; icon: React.JSX.Element }
> = {
  pp_paypal_paypal: {
    title: "PayPal",
    icon: <PayPal />,
  },
  pp_system_default: {
    title: "Manual Payment",
    icon: <CreditCard />,
  },
  pp_nmi_nmi: {
    title: "Credit card",
    icon: <CreditCard />,
  },
  pp_sezzle_sezzle: {
    title: "Sezzle - Buy Now, Pay Later",
    icon: <CreditCard />,
  },
  pp_cod_cod: {
    title: "Cash on Delivery",
    icon: <CreditCard />,
  },
  // Add more payment providers here
}

// Payment provider helper functions
export const isStripe = (providerId?: string) => {
  return providerId?.startsWith("stripe")
}
export const isPaypal = (providerId?: string) => {
  return providerId?.startsWith("pp_paypal")
}
export const isManual = (providerId?: string) => {
  return providerId?.startsWith("pp_system_default")
}
export const isNMI = (providerId?: string) => {
  return providerId?.startsWith("pp_nmi")
}
export const isSezzle = (providerId?: string) => {
  return providerId?.startsWith("pp_sezzle")
}
export const isCOD = (providerId?: string) => {
  return providerId?.startsWith("pp_cod")
}

// Add currencies that don't need to be divided by 100
export const noDivisionCurrencies = [
  "krw",
  "jpy",
  "vnd",
  "clp",
  "pyg",
  "xaf",
  "xof",
  "bif",
  "djf",
  "gnf",
  "kmf",
  "mga",
  "rwf",
  "xpf",
  "htg",
  "vuv",
  "xag",
  "xdr",
  "xau",
]
