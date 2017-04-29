import { ApolloClient, createNetworkInterface } from 'react-apollo'

let apolloClient = null;

const API_URI = process.env.API_URI || 'http://localhost:8080/api';

function _initClient(headers, initialState) {
  return new ApolloClient({
    initialState,
    ssrMode: !process.browser,
    dataIdFromObject: result => result.id || null,
    networkInterface: createNetworkInterface({
      uri: API_URI,
      opts: {
        credentials: 'same-origin'
        // Pass headers here if your graphql server requires them
      }
    })
  })
}

export const initClient = (headers, initialState = {}) => {
  if (!process.env.browser) {
    // Don't persist ApolloClient on the server
    // Send a new instance per session ;)
    return _initClient(headers, initialState);
  }
  if (!apolloClient) {
    apolloClient = _initClient(headers, initialState);
  }
  return apolloClient;
}
