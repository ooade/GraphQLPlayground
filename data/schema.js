export default `
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

  type Query {
    author(firstName: String, lastName: String): Author
    getFortuneCookie: String
  }

  type Mutation {
    author(firstName: String, lastName: String): Author
  }

  schema {
    query: Query
    mutation: Mutation
  }
`;
