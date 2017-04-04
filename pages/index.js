import React from 'react';
import withData from '../lib/withData';

// import components
import CommentsList from '../components/CommentsList';
import SubmitComment from '../components/SubmitComment';

export default withData(props => (
  <div>
    <SubmitComment />
    <CommentsList />
  </div>
))
