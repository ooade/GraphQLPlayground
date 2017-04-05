const express = require('express');
const path = require('path');
const next = require('next');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { createServer } = require('http');

mongoose.connect('mongodb://localhost:27017/graphql');

// Assign ES6 Promise to mongoose
mongoose.Promise = global.Promise;

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dir: '.', dev });
const handle = app.getRequestHandler();

const { graphqlExpress, graphiqlExpress } = require('graphql-server-express');
const { makeExecutableSchema } = require('graphql-tools');

const Schema = require('./data/schema');
const Resolvers = require('./data/resolvers');

const { Comment } = require('./data/connectors');

const executableSchema = makeExecutableSchema({
  typeDefs: Schema,
  resolvers: Resolvers,
});

const GRAPHQL_PORT = 8080;


app.prepare()
  .then(_ => {
    const server = express();

    server.use('/graphql', bodyParser.json(), graphqlExpress({
      schema: executableSchema,
      pretty: true
    }));

    server.use('/graphiql', graphiqlExpress({
      endpointURL: '/graphql'
    }));

    server.get('*', (req, res) => handle(req, res));

    const graphqlServer = createServer(server);

    const io = require('socket.io')(graphqlServer);

    io.on('connection', (socket) => {
      socket.on('client connected', (data) => {
        console.log('connected with', socket.id);
      });

      socket.on('add comment', (data) => {
        console.log('comment added', data);
        socket.broadcast.emit('add comment', data);
      })

      socket.on('disconnect', () => {
        console.log('Socket.io Disconnecting...')
      });
    });

    graphqlServer.listen(GRAPHQL_PORT, () => {
      console.log(`GraphQL Server is now running on http://localhost:${GRAPHQL_PORT}/graphql`);
    });
  });
