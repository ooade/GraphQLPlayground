const { makeExecutableSchema } = require('graphql-tools');
const resolvers = require('./resolvers');

const typeDefs = `
  type Author {
    id: String
    firstName: String
    lastName: String
    posts: [Post]
  }

  type Post {
    id: Int
    title: String
    text: String
    views: Int
    author: Author
  }

  type Errors {
    key: String,
    message: String
  }

  type User {
    id: String #Mongo Ids are 32-bit signed integer, better off coersed to a string.
    email: String
    gravatar: String
  }

  type Comment {
    name: String
    comment: String
  }

  type Query {
    author(firstName: String, lastName: String): Author
    comments: [Comment]
    user: User
    getFortuneCookie: String
  }

  type Mutation {
    signin(email: String!, password: String!): User
    signup(email: String!, password: String!): User
    signout(email: String): User
    signoutall(email: String): User
    author(firstName: String, lastName: String): Author
    comments(name:String, comment: String): Comment
  }

  schema {
    query: Query
    mutation: Mutation
  }
`;

module.exports = makeExecutableSchema({ typeDefs, resolvers });
