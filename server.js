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
const { SubscriptionServer } = require('subscriptions-transport-ws');
const { makeExecutableSchema } = require('graphql-tools');

const Schema = require('./data/schema');
const Resolvers = require('./data/resolvers');
const { subscriptionManager } = require('./data/subscriptions');

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

    graphqlServer.listen(GRAPHQL_PORT, () => {
      console.log(`GraphQL Server is now running on http://localhost:${GRAPHQL_PORT}/graphql`);
    });

    const subscriptionServer = new SubscriptionServer(
      {
        subscriptionManager,
        onConnect: (connectionParams, webSocket) => {
          console.log('SubscriptionServer Connected');
        },
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
        server: graphqlServer,
        path: '/sub'
      }
    );
  });
