const express = require('express');
const path = require('path');
const next = require('next');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const passport = require('passport');
const { createServer } = require('http');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/graphql';

mongoose.connect(MONGO_URI);

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
  // logger: {
  //   log: (e) => {
  //     console.log(e);
  //   }
  // }
});

const GRAPHQL_PORT = process.env.PORT || 8080;

app.prepare()
  .then(_ => {
    const server = express();

    server.use(bodyParser.json());

    server.use(session({
      resave: true,
      saveUninitialized: true,
      secret: process.env.SECRET || 'Meow!',
      store: new MongoStore({ url: MONGO_URI, autoReconnect: true })
    }));

    // Passport JS is what we use to handle our logins
    server.use(passport.initialize());
    server.use(passport.session());

    server.use('/api', graphqlExpress((req) => {
      return {
        context: {
          req
        },
        schema: executableSchema,
        pretty: true
      }
    }));

    server.use('/graphiql', graphiqlExpress({
      endpointURL: '/api'
    }));

    server.get('*', (req, res) => handle(req, res));

    const graphqlServer = createServer(server);

    require('./sockets')(graphqlServer);

    graphqlServer.listen(GRAPHQL_PORT, () => {
      console.log(`GraphQL Server is now running on http://localhost:${GRAPHQL_PORT}`);
    });
  });
