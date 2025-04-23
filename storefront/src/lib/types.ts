export interface ProductVariation {
  id: string;
  name: string;
  price: number;
  salePrice?: number;
  inStock: boolean;
  attributes: {
    [key: string]: string;
  };
  image: string;
}

export interface Product {
  id: number | string;
  name: string;
  slug: string;
  description: string;
  price: number;
  salePrice?: number;
  image: string;
  category: string;
  featured?: boolean;
  new?: boolean;
  onSale?: boolean;
  specs?: {
    material?: string;
    length?: string;
    weight?: string;
    handle?: string;
    [key: string]: string | undefined;
  };
  variations?: ProductVariation[];
}

export interface CartItem {
  product: Product;
  quantity: number;
  variation?: ProductVariation;
  medusa_line_item_id?: string; // Added for Medusa integration
}

export interface MedusaRegion {
  id: string;
  name: string;
  currency_code: string;
  countries: MedusaCountry[];
}

export interface MedusaCountry {
  id: string;
  iso_2: string;
  iso_3: string;
  name: string;
  display_name: string;
  region_id: string;
}

// Extend User type to include Medusa customer ID
export interface User {
  id: number | string;
  email: string;
  firstName: string;
  lastName: string;
  orders: Order[];
  medusa_customer_id?: string; // Added for Medusa integration
  addresses?: Address[];
}

export interface Order {
  id: number | string;
  date: string;
  status: string;
  total: number;
  items: OrderItem[];
  shipped?: boolean;
  fulfillmentStatus?: string;
  paymentStatus?: string;
  trackingNumber?: string;
  shippingAddress?: Address;
  billingAddress?: Address;
}

export interface OrderItem {
  productId: number | string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface Address {
  id?: string;
  first_name?: string;
  last_name?: string;
  address_1: string;
  address_2?: string;
  city: string;
  province?: string;
  postal_code: string;
  country_code: string;
  phone?: string;
  default?: boolean;
}

export interface OrderCancellationRequest {
  orderId: string;
  reason: string;
  additionalInfo?: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

export interface AddressChangeRequest {
  orderId: string;
  newAddress: Address;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}