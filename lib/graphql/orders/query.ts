import { GraphQLClient } from 'graphql-request';

export default async function getOrders(id: number) {
  const endpoint = 'https://admin.damneddesigns.com/graphql';

  const graphQLClient = new GraphQLClient(endpoint, {
    headers: {
      Authorization: `Basic ${process.env.CREATE_ORDER_PASSWORD}`,
    },
  });

  const query = `
    query ($customerId: Int) {
      orders(where: { customerId: $customerId }) {
        nodes {
          databaseId
          orderNumber
          date
          subtotal
          discountTotal
          discountTax
          shippingTotal
          shippingTax
          totalTax
          total 
          lineItems {
        nodes {
          product {
            node {
              name
            }
          }
          quantity
          total
        }
      }
        }
      }
    }
  `;

  const variables = {
    customerId: id,
  };

  const data = await graphQLClient.request(query, variables);

  return data;
}
