import React from 'react';
import withData from '../lib/withData';

const socket = require('socket.io-client')('');

socket.on('connect', () => {
	console.log('socketio client connected...');
});

socket.emit('client connected', 'user');

// import components
import CommentsList from '../components/CommentsList';
import SubmitComment from '../components/SubmitComment';
import RandomQuote from '../components/RandomQuote';

// Place a componentWillMount here ;)

export default withData(props => (
	<div>
		{props.user ? <p> {props.user.email} </p> : <p>Not logged in</p>}
		<SubmitComment socket={socket} query={props.url.query} />
		<CommentsList socket={socket} query={props.url.query} />
		<RandomQuote />
	</div>
));
