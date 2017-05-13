const express = require('express');
const path = require('path');
const next = require('next');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const { createServer } = require('http');
const admin = require('firebase-admin');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/graphql';

mongoose.connect(MONGO_URI);

mongoose.connection.on('error', error => {
	console.log('Check your database connection');
	process.exit(1);
});

mongoose.connection.on('open', () => {
	console.log('Mongo connected 😉');
});

// Assign ES6 Promise to mongoose
mongoose.Promise = global.Promise;

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dir: '.', dev });
const handle = app.getRequestHandler();

const { serverConfig } = require('../lib/config');

const firebase = admin.initializeApp(
	{
		credential: admin.credential.cert(serverConfig),
		databaseURL: 'https://test-4facd.firebaseio.com'
	},
	'server'
);

const { graphqlExpress, graphiqlExpress } = require('graphql-server-express');

const schema = require('./data/schema');

const GRAPHQL_PORT = process.env.PORT || 8080;

app.prepare().then(_ => {
	const server = express();

	server.use(bodyParser.json());
	server.use(bodyParser.urlencoded({ extended: false }));

	server.use(
		session({
			resave: false, //don't save session if unmodified
			saveUninitialized: false, // don't create session until something stored
			secret: process.env.SECRET || 'Meow!',
			cookie: {
				maxAge: 604800000
			}
		})
	);

	server.use((req, res, next) => {
		req.firebaseServer = firebase;
		next();
	});

	server.post('/token/verify', (req, res) => {
		if (!req.body) return res.sendStatus(400);

		const token = req.body.token;
		firebase
			.auth()
			.verifyIdToken(token)
			.then(user => {
				req.session.user = user;
				return user;
			})
			.then(user => res.json({ status: true, user }))
			.catch(error => res.json({ error }));
	});

	server.post('/token/destroy', (req, res) => {
		req.session.user = null;
		res.json({ status: true });
	});

	server.use(
		'/graphql',
		graphqlExpress(req => ({
			schema,
			pretty: true,
			context: req
		}))
	);

	server.use(
		'/graphiql',
		graphiqlExpress({
			endpointURL: '/graphql'
		})
	);

	server.get('*', (req, res) => handle(req, res));

	const graphqlServer = createServer(server);

	require('./sockets')(graphqlServer);

	graphqlServer.listen(GRAPHQL_PORT, () => {
		console.log(
			`GraphQL Server is now running on http://localhost:${GRAPHQL_PORT}`
		);
	});
});
