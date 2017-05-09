import { gql, graphql } from 'react-apollo';

const mutator = gql`
	query getQuote {
		getFortuneCookie
	}
`;

export default graphql(mutator)(({ data: { getFortuneCookie, error } }) => (
	<div>
		{error &&
			error.graphQLErrors.map(e => [
				<h4>Error:</h4>,
				<p key={e.message} style={{ color: 'red' }}>{e.message}</p>
			])}
		{getFortuneCookie}
	</div>
));
