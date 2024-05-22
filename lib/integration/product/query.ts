import client from "@/lib/graphql/index";
import { GET_PRODUCT } from "@/lib/graphql/product/query";

export const fetchProduct = async (productId: string): Promise<any> => {
  return new Promise(async (resolve, reject) => {
    await client
      .query({
        query: await GET_PRODUCT(productId),
      })
      .then((data) => {
        resolve(data.data.product);
      })
      .catch((err) => {
        reject(err);
      });
  });
};
