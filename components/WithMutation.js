// HOC wrapper for mutations
import { graphql, gql } from 'react-apollo';
import { map } from 'lodash';

export default function withMutation({ name, args }) {
	let mutation;

	if (args) {
		const args1 = map(args, (value, key) => `$${key}: ${value}`);
		const args2 = map(args, (value, key) => `${key}: $${key}`);
		const args3 = map(args, (value, key) => `${key}`);

		mutation = `
      mutation ${name}(${args1}) {
        ${name}(${args2}) {
          ${args3}
        }
      }
    `;
	} else {
		mutation = `
      mutation ${name} {
        ${name}
      }
    `;
	}

	return graphql(gql`${mutation}`, {
		props: ({ ownProps, mutate }) => ({
			[name]: (vars, query) => {
				return mutate({
					variables: vars,
					refetchQueries: [{ query }]
				});
			}
		})
	});
}
