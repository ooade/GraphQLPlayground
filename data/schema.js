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

  type Comment {
    name: String
    comment: String
  }

  type Query {
    author(firstName: String, lastName: String): Author
    comments: [Comment]
    getFortuneCookie: String
  }

  type Mutation {
    author(firstName: String, lastName: String): Author
    comments(name:String, comment: String): Comment
  }

  type Subscription {
    newComments: [Comment]
  }

  schema {
    query: Query
    mutation: Mutation
    subscription: Subscription
  }
`;
