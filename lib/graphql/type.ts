export interface Category {
  id: string;
  name: string;
  productCategoryId: Number;
  uri: string;
  image: {
    sourceUrl: string;
  };
  count: Number;
}

export interface Product {
  cursor: string;
  node: {
    id: string;
    name: string;
    totalSales: any;
    onSale: Boolean;
    reviewCount: number;
    price: number;
    image: {
      sourceUrl: string;
      date: string
    };
  };
}

export interface Menu {
  name: string;
  uri: string;
}

export interface ProductInfo {
  id: string;
  name: string;
  totalSales: number;  // Assuming this is always a number
  shortDescription: string;
  description: string;
  price: string;
  attributes: {
    edges: {
      node: {
        options: string[];
        attributeId: number;  // Corrected typo
      }
    }[]
  };
  image: {
    sourceUrl: string;
  };
  galleryImages: {
    edges: {
      node: {
        sourceUrl: string;
      }
    }[];
  }
}
