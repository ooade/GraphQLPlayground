import { ApolloClient, createNetworkInterface } from 'react-apollo'
import { SubscriptionClient, addGraphQLSubscriptions } from 'subscriptions-transport-ws'

const networkInterface = createNetworkInterface({
  uri: 'http://localhost:8080/graphql',
  opts: {
    credentials: 'same-origin'
    // Pass headers here if your graphql server requires them
  }
});

let wsClient;

if (typeof WebSocket !== 'undefined') {
  wsClient = new SubscriptionClient(`ws://localhost:8080/sub`, {
    reconnect: true
  });
}

// Extend the network interface with the WebSocket
const networkInterfaceWithSubscriptions = addGraphQLSubscriptions(
  networkInterface,
  wsClient
);

export const initClient = (headers, initialState = {}) => {
  return new ApolloClient({
    initialState,
    ssrMode: !process.browser,
    dataIdFromObject: result => result.id || null,
    networkInterface: networkInterfaceWithSubscriptions
  })
}
