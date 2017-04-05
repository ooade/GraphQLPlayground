const { Author, Post, Comment, FortuneCookie, View } = require('./connectors');

const resolvers = {
  Query: {
    author(root, args) {
      return Author.findOne(Object.assign({}, args)).populate('posts');
    },
    comments(root) {
      // Return all comments
      return Comment.find();
    },
    getFortuneCookie() {
      return FortuneCookie.getOne();
    },
  },
  Mutation: {
    author(root, args) {
      const author = new Author(args);
      author.save();

      return author;
    },
    comments(root, args) {
      const comment = new Comment(args);
      comment.save();

      return comment;
    }
  },
  Subscription: {
    newComments(comment) {
      // console.log(comment);

      return Comment.find();
    }
  },
  Author: {
    posts(author) {
      return author.posts;
    },
  },
  Post: {
    views(post) {
      return View.findOne({ postId: post._id }).then(res => res.views);
    },
    author(post) {
      // populate author in post n return the authorr :)
      return Post.findOne(post)
        .populate('author')
        .then(author => author.author);
    },
  },
};

module.exports = resolvers;
