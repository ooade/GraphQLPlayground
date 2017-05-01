import React from 'react';
import { gql, graphql } from 'react-apollo';

const LoginForm = (props) => {
  let state = {
    email: '',
    password: ''
  }

  const onFormSubmit = (e) => {
    e.preventDefault();
    props.mutate({
      variables: {
        email: state.email,
        password: state.password
      }
    })
    .then(d => console.log(d))
    .catch(e => console.log(e.message));
  }

  return (
    <form onSubmit={onFormSubmit}>
      <input type='text' placeholder='email' onInput={e => state.email = e.target.value}/> <br/>
      <input type='password' placeholder='password' onInput={e => state.password = e.target.value}/> <br/>
      <button> Submit </button>
    </form>
  )
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

export default graphql(mutator)(LoginForm);
