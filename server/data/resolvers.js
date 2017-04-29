const { Author, Post, Comment, FortuneCookie, View } = require('./connectors');
const User = require('../models/User');
const promisify = require('es6-promisify');
const validator = require('validator');
const passport = require('passport');

passport.use(User.createStrategy());

// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

exports.isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next(); // carry on!
  }
};

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
    },
    signin(root, { email, password }, { req }) {
      passport.authenticate('local', (err, user) => {
        if (!user) {
          console.log('Not good!');
        }
        console.log(user);
        req.login(user, () => ({ user, isLoggedIn: req.isAuthenticated }));
      })({ body: { email, password }});
      return {
        isLoggedIn: req.isAuthenticated
      }
      // await login(, password });
      // check login
      // if auth, send a token
    },
    async signup(root, { email, password }) {
      const user = new User({ email });
      const register = promisify(User.register, User);
      let errors = [];

      if (!validator.isEmail(email)) {
        errors.push({ key: 'email', message: 'Invalid Email Address' });
      }

      if (validator.isEmpty(email)) {
        errors.push({ key: 'email', message: 'Provide Email Address' });
      }

      if (validator.isEmpty(password)) {
        errors.push({ key: 'password', message: 'Provide password' });
      }

      /* Send Custom error messages before pivoting to passport-local-mongoose */
      if (errors.length > 0) {
        return { errors }
      }

      try {
        await register(user, password);
      } catch(e) {
        errors.push({ key: null, message: e.message.replace('username', 'email') });
        return { errors }
      }

      return user;
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
