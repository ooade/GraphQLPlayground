const { Author, Post, Comment, FortuneCookie, View } = require('./connectors');
const User = require('../models/User');
const AuthService = require('../services/auth');

const resolvers = {
	Query: {
		author(root, args) {
			return Author.findOne(Object.assign({}, args)).populate('posts');
		},
		comments(root, args, { user }) {
			// if (!user) {
			// 	throw new Error('Must be logged in to view comments');
			// }
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
		signin(root, { email, password }, ctx) {
			return AuthService.signin({ email, password, ctx });
		},
		signup(root, { email, password }, ctx) {
			return AuthService.signup({ email, password, ctx });
		},
		signout(root, args, ctx) {
			return AuthService.signout(ctx);
		},
		signoutall(root, { email }, ctx) {
			return AuthService.signoutall({ email, ctx });
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
		}
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
		}
	}
};

module.exports = resolvers;
