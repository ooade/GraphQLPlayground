import { Author, Post, FortuneCookie, View } from './connectors';

const resolvers = {
  Query: {
    author(root, args) {
      return Author.findOne({ ...args }).populate('posts');
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

export default resolvers;
