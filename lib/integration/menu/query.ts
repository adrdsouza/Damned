import client from "@/lib/graphql/index";
import { GET_MENU } from "@/lib/graphql/menu/query";

export const fetchPosts = async (): Promise<any> => {
  return new Promise(async (resolve, reject) => {
    await client
      .query({
        query: GET_MENU,
      })
      .then((data) => {
        resolve(data.data.menus.nodes);
      })
      .catch((err) => {
        reject(err);
      });
  });
};
