import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import { createServer } from 'http';

mongoose.connect('mongodb://localhost:27017/graphql');

// Assign ES6 Promise to mongoose
mongoose.Promise = global.Promise;

import { graphqlExpress, graphiqlExpress } from 'graphql-server-express';
import { SubscriptionServer } from 'subscriptions-transport-ws';
import { makeExecutableSchema } from 'graphql-tools';

import Schema from './data/schema';
import Resolvers from './data/resolvers';
import { subscriptionManager } from './data/subscriptions';

import { Comment } from './data/connectors';

const executableSchema = makeExecutableSchema({
  typeDefs: Schema,
  resolvers: Resolvers,
});

const GRAPHQL_PORT = 8080;

const app = express();

app.use('/graphql', bodyParser.json(), graphqlExpress({
  schema: executableSchema
}));

app.use('/graphiql', graphiqlExpress({
  endpointURL: '/graphql',
}));

const server = createServer(app);

server.listen(GRAPHQL_PORT, () => {
  console.log(`GraphQL Server is now running on http://localhost:${GRAPHQL_PORT}/graphql`);
});

const subscriptionServer = new SubscriptionServer(
  {
    subscriptionManager,
    // onConnect: async (connectionParams, webSocket) => {
    //   console.log('Sub is connecting///')
    // },
    // onSubscribe: (msg, params) => {
    //   console.log(msg, params);
    //   return Object.assign({}, params, {
    //     context: {
    //       Comments: new Comments()
    //     }
    //   })
    // }
  },
  {
    server,
    path: '/subscriptions'
  }
);
