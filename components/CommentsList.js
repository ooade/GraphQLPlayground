import React from 'react';
import { gql, graphql } from 'react-apollo';

class CommentsList extends React.Component {
  state = {
    typing: ''
  }

  componentDidMount() {
    const { data: { refetch }, socket, query: { key } } = this.props;

    socket.emit('join private', key);

    socket.on('add comment', (data) => {
      refetch();
      this.setState({ typing: '' });
    });

    socket.on('typing', (data) => {
      this.setState({ typing: `${data} is typing...` });
    });
  }

  render() {
    const { data: { loading, comments } } = this.props;

    if (loading) return <div> Loading... </div>;

    return (
      <div>
        { comments.map((comment, key) =>
          <div key={key}>
            {comment.name}: {comment.comment}
          </div>
        )}
        <p> { this.state.typing }</p>
      </div>
    );
  }
}

export const commentListQuery = gql`
  {
    comments {
      name
      comment
    }
  }
`;

// export default graphql(commentListQuery, {
//   options: { pollInterval: 5000 }
// })(CommentsList);
export default graphql(commentListQuery)(CommentsList);
