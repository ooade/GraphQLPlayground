import React from 'react';
import { gql, graphql } from 'react-apollo';

import { commentListQuery } from './CommentsList';

class SubmitComment extends React.Component {
  state = {
    name: '',
    comment: ''
  }

  onSubmit(e) {
    e.preventDefault();

    this.props.mutate({
      variables: {
        name: this.state.name,
        comment: this.state.comment
      },
      refetchQueries: [ { query: commentListQuery }]
    }).then(() => this.setState({ name: '', comment: '' }));
  }

  render() {
    return (
      <form onSubmit={this.onSubmit.bind(this)}>
        <input
          placeholder='name'
          value={this.state.name}
          onChange={ e => this.setState({ name: e.target.value }) }
        />
        <input
          placeholder='comment'
          value={this.state.comment}
          onChange={ e => this.setState({ comment: e.target.value }) }
        />
        <button>Submit</button>
      </form>
    )
  }
}

const mutator = gql`
  mutation submitComment($name: String!, $comment: String!) {
    comments(name: $name, comment: $comment) {
      name
      comment
    }
  }
`;

export default graphql(mutator)(SubmitComment);
// export default graphql(createAuthor, {
//   props: ({ mutate }) => ({
//     createAuthor(name, comment) => mutate({
//       variables: { name, comment },
//       updateQueries: {
//         allAuthors: (prev, { mutationResult }) => {
//           const newAuthor = mutationResult.data.createPost;
//
//           return Object.assign({}, prev, {
//             allAuthors: [newAuthor, ...prev.allAuthors]
//           })
//         }
//       }
//     })
//   })
// })();
