import { useMemo } from "react";
import { ApolloClient, HttpLink, InMemoryCache, split } from "@apollo/client";
import { getMainDefinition } from "@apollo/client/utilities";
import merge from "deepmerge";
import { WebSocketLink } from "@apollo/client/link/ws";

import { getToken } from "../utils/tokenUtils";

export const APOLLO_STATE_PROP_NAME = "__APOLLO_STATE__";

let apolloClient;
let token = `Bearer ${getToken()}`;

const httpLink = new HttpLink({
  // Server URL (must be absolute)
  uri: "http://localhost:5000/api",
  // Additional fetch() options like `credentials` or `headers`
  credentials: "include",
  headers: {
    Authorization: token,
  },
});

const wsLink =
  process.browser &&
  new WebSocketLink({
    uri: `ws://localhost:5000/subscriptions`,
    options: {
      reconnect: true,
      connectionParams: {
        Authorization: token,
      },
    },
  });

const link = process.browser
  ? split(
      //only create the split in the browser
      // split based on operation type
      ({ query }) => {
        const { kind, operation } = getMainDefinition(query);
        return kind === "OperationDefinition" && operation === "subscription";
      },
      wsLink,
      httpLink
    )
  : httpLink;

function createApolloClient() {
  return new ApolloClient({
    link,
    ssrMode: typeof window === "undefined",
    cache: new InMemoryCache({}),
  });
}

export function initializeApollo(initialState = null) {
  const _apolloClient = apolloClient ?? createApolloClient();

  // If your page has Next.js data fetching methods that use Apollo Client, the initial state
  // gets hydrated here
  if (initialState) {
    // Get existing cache, loaded during client side data fetching
    const existingCache = _apolloClient.extract();

    // Merge the existing cache into data passed from getStaticProps/getServerSideProps
    const data = merge(initialState, existingCache);

    // Restore the cache with the merged data
    _apolloClient.cache.restore(data);
  }
  // For SSG and SSR always create a new Apollo Client
  if (typeof window === "undefined") {
    return _apolloClient;
  }
  // Create the Apollo Client once in the client
  if (!apolloClient) {
    apolloClient = _apolloClient;
  }

  return _apolloClient;
}

export function addApolloState(client, pageProps) {
  if (pageProps?.props) {
    pageProps.props[APOLLO_STATE_PROP_NAME] = client.cache.extract();
  }

  return pageProps;
}

export function useApollo(pageProps) {
  const state = pageProps[APOLLO_STATE_PROP_NAME];
  const store = useMemo(() => initializeApollo(state), [state]);
  return store;
}
