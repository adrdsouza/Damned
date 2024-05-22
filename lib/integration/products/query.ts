import client from "@/lib/graphql/index";
import { GET_PRODUCT } from "@/lib/graphql/products/query";

export const fetchProducts = async (categoryId: string, page?: string, maxCount?: string): Promise<any> => {
  return new Promise(async (resolve, reject) => {
    await client
      .query({
        query: await GET_PRODUCT(categoryId),
      })
      .then((data) => {        
        resolve(data.data.products.edges);
      })
      .catch((err) => {
        reject(err);
      });
  });
};
