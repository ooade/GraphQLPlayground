import { ApolloClient, createNetworkInterface } from 'react-apollo'

let apolloClient = null;

function createClient(headers, initialState) {
  return new ApolloClient({
    initialState,
    ssrMode: !process.browser,
    dataIdFromObject: result => result.id || null,
    networkInterface: createNetworkInterface({
      uri: 'http://localhost:8080/graphql',
      opts: {
        credentials: 'same-origin',
        headers
      }
    })
  })
}

export const initClient = (headers, initialState = {}) => {
  if (!process.browser) {
    // Don't persist ApolloClient on the server
    // Send a new instance per session ;)
    return createClient(headers, initialState);
  }
  if (!apolloClient) {
    apolloClient = createClient(headers, initialState);
  }
  return apolloClient;
}
