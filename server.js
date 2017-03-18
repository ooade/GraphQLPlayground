import express from 'express';
import bodyParser from 'body-parser';

import { graphqlExpress, graphiqlExpress } from 'graphql-server-express';
import { makeExecutableSchema } from 'graphql-tools';

import Schema from './data/schema';
import Resolvers from './data/resolvers';

const executableSchema = makeExecutableSchema({
  typeDefs: Schema,
  resolvers: Resolvers,
});

const GRAPHQL_PORT = 8080;

const server = express();

server.use('/graphql', bodyParser.json(), graphqlExpress({
  schema: executableSchema
}));

server.use('/graphiql', graphiqlExpress({
  endpointURL: '/graphql',
}));

server.listen(GRAPHQL_PORT, () => console.log(
  `GraphQL Server is now running on http://localhost:${GRAPHQL_PORT}/graphql`
));
