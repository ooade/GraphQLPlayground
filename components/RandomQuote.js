import { gql, graphql } from 'react-apollo';

const mutator = gql`
	query getQuote {
		getFortuneCookie
	}
`;

export default graphql(mutator)(({ data }) => (
	<div>
		{ data.getFortuneCookie }
	</div>
));