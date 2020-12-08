// pages/_app.js
import { ApolloProvider } from "@apollo/client";
import { useApollo } from "../src/utils/apolloClient";
import "bootstrap/dist/css/bootstrap.min.css";

export default function App({ Component, pageProps }) {
  const apolloClient = useApollo(pageProps);

  return (
    <ApolloProvider client={apolloClient}>
      <Component {...pageProps} />
    </ApolloProvider>
  );
}
