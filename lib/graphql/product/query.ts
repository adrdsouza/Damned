import { gql } from "@apollo/client";

export const GET_PRODUCT = (productId: string) => gql`
  {
    product(id: "${productId}") {
      id
      name
      totalSales
      shortDescription
      description
      attributes {
        edges {
          node {
            options
            attributeId
          }
        }
      }
      image {
        sourceUrl
      }
      galleryImages {
        edges {
          cursor
          node {
            sourceUrl
          }
        }
      }
    }
  }`;