import client from "@/lib/graphql/index";
import { GET_CATEGORY, GET_CATEGORYID } from "@/lib/graphql/categories/query";

export const fetchCategories = async (): Promise<any> => {
  return new Promise(async (resolve, reject) => {
    await client
      .query({
        query: GET_CATEGORY,
      })
      .then((data) => {
        resolve(data.data.productCategories.nodes);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const fetchCategoryId = async (productName: string) => {
  return new Promise(async (resolve, reject) => {
    await client
      .query({
        query: GET_CATEGORYID(productName),
      })
      .then((data) => {
        resolve(data.data.productCategories.nodes);
      })
      .catch((err) => {
        reject(err);
      });
  });
}