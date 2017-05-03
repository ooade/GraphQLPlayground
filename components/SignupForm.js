import React from 'react';

export default class extends React.Component {
	state = {
		error: '',
		email: '',
		password: ''
	}

	onFormSubmit = (e) => {
		e.preventDefault();

		const options = {
			method: 'POST',
			headers: {
				'content-type': 'application/json'
			},
			credentials: 'same-origin', // Necessary for our cookie :)
			body: JSON.stringify({
				email: this.state.email,
				password: this.state.password
			})
		}

		fetch('/signup', options)
			.then(res => {
				if (res.redirected) {
					window.location = res.url;
					return;
				}
				
				return res.json();
			})
			.then(({ error }) => {
				if (error) {
					this.setState({ error });
				} else {
					this.setState({ error: '' });
				}
			});
	}

	render() {
		return (
			<form onSubmit={this.onFormSubmit}>
				{ this.state.error &&
					<p style={{ color: 'red' }}>
						{ this.state.error }
					</p>
				}
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