import React from 'react';
import { gql, graphql } from 'react-apollo';

class RegistrationForm extends React.Component {
  state = {
    email: '',
    password: '',
    error: ''
  }

  onFormSubmit = (e) => {
    e.preventDefault();

    this.props.mutate({
      variables: {
        email: this.state.email,
        password: this.state.password
      }
    })
    .then(res => {
      // Put token in localStorage
      localStorage.setItem('token', res.data.signup.token);
      this.setState({ error: '', email: '', password: ''});
    })
    .catch(res => {
      console.log(res);
      this.setState({ error: res.graphQLErrors.map(err => err.message)[0] })
    });
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
    signup(email: $email, password: $password) {
      email
      token
    }
  }
`

export default graphql(mutator)(RegistrationForm);
