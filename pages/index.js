import React from 'react';
import withData from '../lib/withData';

const socket = require('socket.io-client')('');
let socketID;

socket.on('connect', () => {
  socketID = socket.id;
  console.log('socketio client connected...');
});

socket.emit('client connected', 'user');

// import components
import CommentsList from '../components/CommentsList';
import SubmitComment from '../components/SubmitComment';

export default withData(props => (
  <div>
    <SubmitComment socket={socket} />
    <CommentsList socket={socket} />
  </div>
))
