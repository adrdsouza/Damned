import { ApolloClient, InMemoryCache, ApolloLink, HttpLink } from "@apollo/client";
import https from "https";

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const client = new ApolloClient({
  link: new HttpLink({
    uri: " https://damnedventures.com/graphql",
  }),
  cache: new InMemoryCache({ addTypename: false }),
});

export default client;
