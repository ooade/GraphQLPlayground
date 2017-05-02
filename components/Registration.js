import React from 'react';
import { gql, graphql } from 'react-apollo';

class RegistrationForm extends React.Component {
  state = {
    email: 'email',
    password: 'password'
  }

  onFormSubmit = (e) => {
    e.preventDefault();

    this.props.mutate({
      variables: {
        email: this.state.email,
        password: this.state.password
      }
    })
    .then(d => console.log(d))
    .catch(e => console.log(e.message));
  }

  render() {
    return (
      <form onSubmit={this.onFormSubmit}>
        <input 
          type='text' 
          placeholder='email' 
          onInput={e => this.setState({ email: e.target.value }) }
        /> <br/>
        <input 
          type='password' 
          placeholder='password' 
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
      errors {
        key
        message
      }
    }
  }
`

export default graphql(mutator)(RegistrationForm);
