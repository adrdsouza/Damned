import { gql } from "@apollo/client";

export const GET_PRODUCT = async (categoryId: string) => gql`
  query {
    products(where: { categoryId: ${categoryId} }) {
      edges {
        cursor      
        node {
          id
          name
          slug
          totalSales
          onSale
          reviewCount
          reviewsAllowed
          ... on VariableProduct {
            id
            name
            price
            regularPrice
          }
          image {
            altText
            sourceUrl
            title
          }
        }
      }
    }
  }
`;
