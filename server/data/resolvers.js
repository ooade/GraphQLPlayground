const { Author, Post, Comment, FortuneCookie, View } = require('./connectors');
const User = require('../models/User');
const validator = require('validator');
const passport = require('passport');

const resolvers = {
  Query: {
    author(root, args) {
      return Author.findOne(Object.assign({}, args)).populate('posts');
    },
    comments(root, args, { user }) {
      if (!user) {
        throw new Error('Must be logged in to view comments');
      }
      // Return all comments
      return Comment.find();
    },
    getFortuneCookie() {
      return FortuneCookie.getOne();
    },
    user(root, args, { user }) {
      if (!user) {
        throw new Error('Must be logged in to view your profile');
      }

      return user;
    }
  },
  Mutation: {
    author(root, args) {
      const author = new Author(args);
      author.save();

      return author;
    },
    signin(_, args, ctx) {
      return new Promise((resolve, reject) => {
        passport.authenticate('local', (err, user) => {
          if (!user) {
            return reject(err);
          }

          ctx.login(user, () => resolve(user));
        })({ body: args });
      });
    },
    signup(_, args, ctx) {
      return new Promise((resolve, reject) => {
        const { email, password } = args;

        if (validator.isEmpty(email)) {
          return reject('Email Address cannot be empty');
        }

        if (!validator.isEmail(email)) {
          return reject('Invalid Email Address');
        }

        if (validator.isEmpty(password)) {
          return reject('Password cannot be empty');
        }

        const user = new User({ email });

        User.register(user, password, (err) => {
          if (err) {
            return reject(err.message);
          }

          ctx.login(user, () => resolve(user));
        });
      });
    },
    comments(root, args) {
      const comment = new Comment(args);
      comment.save();

      return comment;
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
