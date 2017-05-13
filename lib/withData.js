import 'isomorphic-fetch';
import React from 'react';
import { ApolloProvider, getDataFromTree } from 'react-apollo';
import { initClient } from './initClient';
import { AuthChanged } from './firebase';

export default Component =>
	class extends React.Component {
		static async getInitialProps(ctx) {
			const user = ctx.req && ctx.req.session ? ctx.req.session.user : null;
			const headers = ctx.req ? ctx.req.headers : {};
			const client = initClient(headers);

			// const unprotectedRoutes = ['/signin', '/signup'];

			// if (!unprotectedRoutes.includes(ctx.pathname) && !ctx.req.user) {
			//   ctx.res.redirect('/signin');
			// }

			const props = {
				url: { query: ctx.query, pathname: ctx.pathname },
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
				} catch (e) {}
			}

			return {
				user,
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

		componentDidMount() {
			AuthChanged().then(user => {
				if (user) {
					this.setState({ user });
					return user
						.getToken()
						.then(token => {
							return fetch('/token/verify', {
								method: 'POST',
								headers: new Headers({ 'Content-Type': 'application/json' }),
								credentials: 'same-origin',
								body: JSON.stringify({ token })
							});
						})
						.then(() => console.log('Verified!'));
				} else {
					this.setState({ user: null });
					return fetch('/token/destroy', {
						method: 'POST',
						credentials: 'same-origin'
					}).then(() => console.log('Destroyed!'));
				}
			});
		}

		render() {
			return (
				<ApolloProvider client={this.client}>
					<Component {...this.props} />
				</ApolloProvider>
			);
		}
	};
