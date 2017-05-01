import React from 'react';
import { gql, graphql } from 'react-apollo';

const RegistrationForm = (props) => {
  let state = {
    email: '',
    password: ''
  }

  const onFormSubmit = (e) => {
    e.preventDefault();
    const options = {
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      credentials: 'same-origin', // Necessary for our cookie :)
      body: JSON.stringify({
        email: state.email,
        password: state.password
      })
    }
    fetch('/login', options);
    // props.mutate({
    //   variables: {
    //     email: state.email,
    //     password: state.password
    //   }
    // })
    // .then(d => console.log(d))
    // .catch(e => console.log(e.message));
  }

  return (
    <form onSubmit={onFormSubmit}>
      <input type='text' placeholder='email' onInput={e => state.email = e.target.value}/> <br/>
      <input type='password' placeholder='password' onInput={e => state.password = e.target.value}/> <br/>
      <button> Submit </button>
      <a href='/'>Go home</a>
    </form>
  )
}

const mutator = gql`
  mutation addUser($email: String!, $password: String!) {
    signin(email: $email, password: $password) {
      email
    }
  }
`

export default RegistrationForm;
