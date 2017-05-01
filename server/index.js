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

const schema = require('./data/schema');

const GRAPHQL_PORT = process.env.PORT || 8080;

app.prepare()
  .then(_ => {
    const server = express();

    server.use(session({
      resave: false, //don't save session if unmodified
      saveUninitialized: false, // don't create session until something stored
      secret: process.env.SECRET || 'Meow!',
      key: process.env.KEY || 1234,
      store: new MongoStore({ url: MONGO_URI, touchAfter: 24 * 3600 /* time period in seconds(24 hours) */ })
    }));

    server.use(bodyParser.json());

    // Passport JS is what we use to handle our logins
    server.use(passport.initialize());
    server.use(passport.session());

    server.post('/login', (req, res, next) => {
      const { email, password } = req.body;

      passport.authenticate('local', (err, user) => {
        if (!user) {
          console.log('Not found!');
          return res.end('Auth error!')
        }

        req.login(user, () => {
          console.log('Logged in', user);
        });
        next(user);
      })({ body: { email, password }});
    });

    server.use('/graphql', graphqlExpress((req) => {
      return {
        schema,
        context: {
          user: req.user
        }
      }
    }));

    server.use('/graphiql', graphiqlExpress({
      endpointURL: '/graphql'
    }));

    server.get('*', (req, res) => handle(req, res));

    const graphqlServer = createServer(server);

    require('./sockets')(graphqlServer);

    graphqlServer.listen(GRAPHQL_PORT, () => {
      console.log(`GraphQL Server is now running on http://localhost:${GRAPHQL_PORT}`);
    });
  });
