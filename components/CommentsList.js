import React from 'react';
import { gql, graphql } from 'react-apollo';

function CommentsList({ data: { loading, comments }}) {
  if (loading) return <div> Loading... </div>;
  
  return (
    <div>
      { comments.map((comment, key) =>
        <div key={key}>
          {comment.name}: {comment.comment}
        </div>
      )}
    </div>
  );
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