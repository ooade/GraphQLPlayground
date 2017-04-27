const express = require('express');
const path = require('path');
const next = require('next');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { createServer } = require('http');
const chalk = require('chalk');

mongoose.connect('mongodb://localhost:27017/graphql');

mongoose.connection.on('error', (error) => {
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

const { graphqlExpress, graphiqlExpress } = require('graphql-server-express');
const { makeExecutableSchema } = require('graphql-tools');

const Schema = require('./data/schema');
const Resolvers = require('./data/resolvers');

const { Comment } = require('./data/connectors');

const executableSchema = makeExecutableSchema({
  typeDefs: Schema,
  resolvers: Resolvers,
});

const GRAPHQL_PORT = process.env.PORT || 8080;

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

    require('./sockets')(graphqlServer);

    graphqlServer.listen(GRAPHQL_PORT, () => {
      console.log(`GraphQL Server is now running on http://localhost:${GRAPHQL_PORT}/graphql`);
    });
  });
