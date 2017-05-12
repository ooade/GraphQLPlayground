import React from 'react';
import { signin } from '../lib/firebase';

class SigninForm extends React.Component {
	state = {
		email: '',
		password: '',
		errors: ''
	};

	onFormSubmit = e => {
		e.preventDefault();

		signin({ email: this.state.email, password: this.state.password })
			.then(() => {
				this.setState({ error: '' });
				// window.location = '/';
			})
			.catch(error => this.setState({ error: error.message }));
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
				<a href="/">Go home</a> {' '}
				<a href="/signup">Signup</a>
			</form>
		);
	}
}

export default SigninForm;
