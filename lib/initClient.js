import { ApolloClient, createBatchingNetworkInterface } from 'react-apollo';

let apolloClient = null;

function createClient(headers, initialState) {
	return new ApolloClient({
		initialState,
		ssrMode: !process.browser,
		dataIdFromObject: result => result.id || null,
		networkInterface: createBatchingNetworkInterface({
			uri: 'http://localhost:8080/graphql',
			batchInterval: 10,
			opts: {
				credentials: 'same-origin',
				headers
			}
		}).use([
			{
				applyBatchMiddleware(req, next) {
          console.log(req.requests);
					next();
				}
			}
		])
	});
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
};
