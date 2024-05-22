import { gql } from "@apollo/client";

export const GET_CATEGORY = gql`
  query {
    productCategories {
      nodes {
        id
        name
        uri
        image {
          sourceUrl
        }
        productCategoryId
      }
    }
  }
`;

export const GET_CATEGORYID = (productName: string) => gql`
  query {
    productCategories(where: { name: "${productName}" }) {
      nodes {
        productCategoryId
      }
    }
  }
`;
