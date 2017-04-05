import { ApolloClient, createNetworkInterface } from 'react-apollo'

export const initClient = (headers, initialState = {}) => {
  return new ApolloClient({
    initialState,
    ssrMode: !process.browser,
    dataIdFromObject: result => result.id || null,
    networkInterface: createNetworkInterface({
      uri: 'http://localhost:8080/graphql',
      opts: {
        credentials: 'same-origin'
        // Pass headers here if your graphql server requires them
      }
    })
  })
}
