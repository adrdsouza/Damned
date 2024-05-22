import { gql } from "@apollo/client";

export const GET_MENU = gql`
  query {
    menus {
      nodes {
        name
        uri
      }
    }
  }
`;
