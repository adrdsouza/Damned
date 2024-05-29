import { gql } from "@apollo/client";

export const GET_PRODUCT = async (categoryId: string) => gql`
  query {
    products(where: {categoryId: ${categoryId}}, first: 100) {
      edges {
        cursor
        node {
          id
          name
          totalSales
          onSale
          reviewCount
          image {
            sourceUrl
            date
          }
          ... on VariableProduct {
            price          
          }
        }
      }
    }
  }
`;
