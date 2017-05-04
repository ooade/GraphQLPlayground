const SocketIO = require('socket.io');

module.exports = (server) => {
	const io = SocketIO(server);
	
	io.on('connection', (socket) => {
		socket.on('client connected', (data) => {
			console.log('connected with', socket.id);
		});

		socket.on('add comment', (comment, key) => {
			socket.broadcast.emit('add comment', comment);
		})

		// For private chats distinguished by query
		socket.on('join private', (key) => {
			socket.join(key);
		});

		socket.on('typing', (data, key) => {
			socket.broadcast.to(key).emit('typing', data);
		})

		socket.on('disconnect', () => {
			console.log('Socket.io Disconnecting...')
		});
	});
}
