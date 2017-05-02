import React from 'react';
import { gql, graphql } from 'react-apollo';

class LoginForm extends React.Component {
  state = {
    email: '',
    password: '',
    error: ''
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
    fetch('/login', options)
      .then(data => data.json())
      .then(data => {
        this.setState({ email: '', password: '', error: '' });
        localStorage.setItem('token', data.token);
      })
      .catch(() => {
        this.setState({ error: 'Username or Password incorrect' });
      });
    // props.mutate({
    //   variables: {
    //     email: state.email,
    //     password: state.password
    //   }
    // })
    // .then(d => console.log(d))
    // .catch(e => console.log(e.message));
  }

  render() {
    return (
      <form onSubmit={this.onFormSubmit}>
        {this.state.error && <p style={{color: 'red'}}>{this.state.error}</p>}
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
  mutation addUser($email: String!, $password: String!) {
    signin(email: $email, password: $password) {
      email
    }
  }
`

export default LoginForm;
