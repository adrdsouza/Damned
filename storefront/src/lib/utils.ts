import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export const PLACEHOLDER_IMAGE = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300' fill='%23ccc'%3E%3Crect width='400' height='300'/%3E%3Cpath d='M159.52 154.91h80.96v-9.84h-80.96v9.84zm0-19.68h80.96v-9.84h-80.96v9.84zm-19.68 39.36h120.32v-68.88h-120.32v68.88zm-9.84-78.72h140v88.56h-140v-88.56z' fill='%23999'/%3E%3C/svg%3E";
export function getImageWithFallback(src: string | undefined) {
  return src || PLACEHOLDER_IMAGE;
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Convert price from cents to dollars
export function formatMedusaPrice(amount: number | null | undefined): number {
  if (amount === null || amount === undefined) return 0;
  return amount / 100;
}

// Format price with currency symbol
export function formatPrice(amount: number | null | undefined, currency = 'USD'): string {
  if (amount === null || amount === undefined) return '$0.00';
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(amount);
}

// Map Medusa product status to application status
export function mapOrderStatus(status: string): string {
  const statusMap = {
    'pending': 'processing',
    'processing': 'processing',
    'shipped': 'shipped',
    'completed': 'delivered',
    'canceled': 'cancelled',
    'requires_action': 'processing'
  };
  
  return statusMap[status] || status;
}