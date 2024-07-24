import { PropsWithChildren } from 'react';
import { ProductProvider as Provider, Product } from '@woographql/react-hooks';

export interface ProductProviderProps {
  product: Product;
}
export function ProductProvider({ product, children }: PropsWithChildren<ProductProviderProps>) {
  return (
    <Provider product={product as Product}>
      {children}
    </Provider>
  )
}
