import { useMemo } from "react";
import { ApolloClient, HttpLink, InMemoryCache, split } from "@apollo/client";
import { getMainDefinition } from "@apollo/client/utilities";
import merge from "deepmerge";
import { WebSocketLink } from "@apollo/client/link/ws";

import { getToken } from "../utils/tokenUtils";

export const APOLLO_STATE_PROP_NAME = "__APOLLO_STATE__";

let apolloClient;
let token = `Bearer ${getToken()}`;

function httpLink() {
  return new HttpLink({
    // Server URL (must be absolute)
    uri: "http://localhost:5000/api",
    // Additional fetch() options like `credentials` or `headers`
    credentials: "same-origin",
    headers: {
      Authorization: token,
    },
  });
}
function wsLink() {
  return new WebSocketLink({
    uri: `ws://localhost:5000/subscriptions`,
    options: {
      reconnect: true,
      connectionParams: {
        Authorization: token,
      },
    },
  });
}

function link() {
  split(
    ({ query }) => {
      const definition = getMainDefinition(query);
      return (
        definition.kind === "OperationDefinition" &&
        definition.operation === "subscription"
      );
    },
    wsLink,
    httpLink
  );
}

function createApolloClient() {
  return new ApolloClient({
    ssrMode: typeof window === "undefined",
    link,
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
