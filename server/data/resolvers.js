const { Author, Post, Comment, FortuneCookie, View } = require('./connectors');
const User = require('../models/User');
const promisify = require('es6-promisify');
const validator = require('validator');
const jwt = require('jwt-simple');

function tokenForUser(user) {
  const timeStamp = new Date().getTime();
  return jwt.encode({ id: user.id, iat: timeStamp }, 'Meow!');
}

const passport = require('passport');
require('../passport');

// const requireAuth = passport.authenticate('jwt', { session: false });

const resolvers = {
  Query: {
    author(root, args) {
      return Author.findOne(Object.assign({}, args)).populate('posts');
    },
    comments(root, args) {
      console.log(args.token);
      // if (!user) {
      //   throw new Error('Must be logged in to view comments');
      // }

      // Return all comments
      return Promise.resolve()
        .then(() => Comment.find());
    },
    getFortuneCookie() {
      return FortuneCookie.getOne();
    },
    user(root, args, { user }) {
      if (!user) {
        throw new Error('Must be logged in to view users');
      }

      return Promise.resolve()
        .then(() => user);
    }
  },
  Mutation: {
    author(root, args) {
      const author = new Author(args);
      author.save();

      return author;
    },
    comments(root, args, { token }) {
      console.log(token);
      const comment = new Comment(args);
      comment.save();

      return comment;
    },
    signin(root, { email, password}) {
      return new Promise((resolve, reject) => {
        const req = {
          body: {
            email,
            password
          }
        };

        requireSignin(req);
      });
    },
    signup(root, { email, password }, context) {
      return new Promise((resolve, reject) => {
        User.findOne({ email }, (err, existingUser) => {
          if (err) {
            return reject(err); 
          }

          if (existingUser) {
            return reject('Email already in use');
          }

          if (validator.isEmpty(email)) {
            return reject('Provide Email Address');
          }

          if (!validator.isEmail(email)) {
            return reject('Invalid Email Address');
          }

          if (validator.isEmpty(password)) {
            return reject('Provide password');
          }

          const user = new User({ email, password });
          const token = tokenForUser(user);

          context.token = token;

          user.save(() => {
            return resolve(
              Object.assign({}, JSON.parse(JSON.stringify(user)), { token })
              );
          });
        });
      });
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
