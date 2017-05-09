import 'isomorphic-fetch';
import React from 'react';
import { ApolloProvider, getDataFromTree } from 'react-apollo';
import { initClient } from './initClient';

export default Component =>
	class extends React.Component {
		static async getInitialProps(ctx) {
			const headers = ctx.req ? ctx.req.headers : {};
			const client = initClient(headers);

			// const unprotectedRoutes = ['/signin', '/signup'];

			// if (!unprotectedRoutes.includes(ctx.pathname) && !ctx.req.user) {
			//   ctx.res.redirect('/signin');
			// }

			const props = {
				url: { query: ctx.query, pathname: ctx.pathname },
				isLoggedIn: !!ctx.req.user,
				// Grab all getInitialProps props :p
				...(await (Component.getInitialProps
					? Component.getInitialProps(ctx)
					: {}))
			};

			if (!process.browser) {
				const app = (
					<ApolloProvider client={client}>
						<Component {...props} />
					</ApolloProvider>
				);

				try {
					// catch SSR errors ;)
					await getDataFromTree(app);
				} catch(e) {}
			}

			return {
				initialState: {
					apollo: {
						data: client.getInitialState().data
					}
				},
				headers,
				...props
			};
		}

		constructor(props) {
			super(props);

			this.client = initClient(props.headers, props.initialState);
		}

		render() {
			return (
				<ApolloProvider client={this.client}>
					<Component {...this.props} />
				</ApolloProvider>
			);
		}
	};
