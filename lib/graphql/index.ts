import { GraphQLClient } from 'graphql-request';

export const getReviews = async () => {
  try {
    const endpoint = process.env.GRAPHQL_ENDPOINT as string;

    const graphQLClient = new GraphQLClient(endpoint);

    const query = `
    query getTrustPilotReviews($limit: Int) {
      trustpilotReviews(limit: $limit) {
        id
        json_data
        time_stamp
      }
    }
  `;

    const variables = {
      limit: 10,
    };

    const data = await graphQLClient.request(query, variables);

    return data;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const addToWaitlist = async (productId, email) => {
  try {
    const endpoint = process.env.GRAPHQL_ENDPOINT as string;

    const graphQLClient = new GraphQLClient(endpoint);

    const query = `
    query addToWaitlist($email: String, $productId: Int) {
      wcwlAddUserToWaitlist(email: $email, productId: $productId)
    }
  `;
    console.log(productId, email);
    const variables = {
      productId: productId,
      email: email,
    };

    const data: any = await graphQLClient.request(query, variables);

    if (data?.wcwlAddUserToWaitlist) {
      const res = JSON.parse(data?.wcwlAddUserToWaitlist);
      if (res?.errors) return null;
      return res;
    }
  } catch (error) {
    console.log(error);
  }
};
