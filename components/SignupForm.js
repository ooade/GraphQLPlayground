import React from 'react';
import { gql, graphql } from 'react-apollo';

class SignupForm extends React.Component {
	state = {
		email: '',
		password: '',
		errors: []
	}

	onFormSubmit = (e) => {
		e.preventDefault();

		this.props.mutate({
			variables: {
				email: this.state.email,
				password: this.state.password
			}
		}).then(() => {
			// Done!
		}).catch(res => {
			// Error!
			const errors = res.graphQLErrors.map(error => error.message);
      this.setState({ errors });
		});
	}

	render() {
		return (
			<form onSubmit={this.onFormSubmit}>
				{this.state.errors.map(error => <p key={error} style={{color: 'red'}}>{error}</p>)}
				<input
					type='text'
					placeholder='email'
					value={this.state.email}
					onInput={e => this.setState({ email: e.target.value }) }
				/> <br/>
				<input
					type='password'
					placeholder='password'
					value={this.state.password}
					onInput={e => this.setState({ password: e.target.value })}
				/> <br/>
				<button> Submit </button>
				<a href='/'>Go home</a>
			</form>
		)
	}
}

const mutator = gql`
	mutation signup($email: String!, $password: String!) {
		signup(email: $email, password: $password) {
			email
		}
	}
`;

export default graphql(mutator)(SignupForm);