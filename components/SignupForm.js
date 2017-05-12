import React from 'react';
import { signup } from '../lib/firebase';

export default class SignupForm extends React.Component {
	state = {
		email: '',
		password: '',
		errors: ''
	};

	onFormSubmit = e => {
		e.preventDefault();

		signup({ email: this.state.email, password: this.state.password })
			.then(() => this.setState({ error: '' }))
			.catch(error => {
				// Handle Errors
				let errorCode = error.code;
				let errorMessage = error.message;

				if (errorCode === 'auth/weak-password') {
					this.setState({ error: 'The password is too weak.' });
				} else {
					this.setState({ error: errorMessage });
				}
			});
	};

	render() {
		return (
			<form onSubmit={this.onFormSubmit}>
				{this.state.error && <p style={{ color: 'red' }}>{this.state.error}</p>}
				<input
					type="text"
					placeholder="email"
					value={this.state.email}
					onInput={e => this.setState({ email: e.target.value })}
				/>
				{' '}
				<br />
				<input
					type="password"
					placeholder="password"
					value={this.state.password}
					onInput={e => this.setState({ password: e.target.value })}
				/>
				{' '}
				<br />
				<button> Submit </button>
				<a href="/">Go home</a>
			</form>
		);
	}
}
