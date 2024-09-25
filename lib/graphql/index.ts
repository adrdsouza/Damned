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

export const getShippingRate = async (country: string) => {
  try {
    const endpoint = process.env.GRAPHQL_ENDPOINT as string;
    const graphQLClient = new GraphQLClient(endpoint);
    const query = `
    query ($country: String) {
      getShippingRate(country: $country) {
        rate_cost
        rate_id
        rate_label
        instance_id
        method_id
      }
    }
  `;
    const variables = {
      country: country,
    };
    const data: any = await graphQLClient.request(query, variables);
    if (data?.getShippingRate[0]) {
      return {
        id: data?.getShippingRate[0].rate_id,
        instanceId: data?.getShippingRate[0].instance_id,
        methodId: data?.getShippingRate[0].method_id,
        label: data?.getShippingRate[0].rate_label,
        cost: data?.getShippingRate[0].rate_cost,
      };
    }
  } catch (error) {
    console.log(error);
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

export const addCustomFieldToOrder = async (
  orderId: number,
  fieldKey: string,
  fieldValue: string
) => {
  try {
    const endpoint = process.env.GRAPHQL_ENDPOINT as string;

    const graphQLClient = new GraphQLClient(endpoint);

    const mutation = `
    mutation addCustomFieldToOrder($orderId: Int!, $fieldKey: String!, $fieldValue: String!) {
      addCustomFieldToOrder(input: {orderId: $orderId, fieldKey: $fieldKey, fieldValue: $fieldValue}) {
        success
      }
    }
  `;

    const variables = {
      orderId: orderId,
      fieldKey: fieldKey,
      fieldValue: fieldValue,
    };

    const data: any = await graphQLClient.request(mutation, variables);

    if (data?.addCustomFieldToOrder?.success) {
      return true; // Return true if the field was successfully added
    }
  } catch (error) {
    console.error('Error adding custom field to order:', error);
  }
};
