const passport = require('passport');
const User = require('../models/User');
const Session = require('../models/Session');
const validator = require('validator');

passport.use(User.createStrategy());

// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

exports.signin = ({ email, password, ctx }) => {
	return new Promise((resolve, reject) => {
		passport.authenticate('local', (err, user) => {
			if (!user) {
				return reject(err);
			}

			ctx.login(user, () => resolve(user));
		})({ body: { email, password } });
	});
}

exports.signup = ({ email, password, ctx }) => {
	return new Promise((resolve, reject) => {
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
};

exports.signout = (ctx) => {
	ctx.logout();
	console.log('You are now logged out! 👋');
}

exports.signoutall = ({ email, ctx }) => {
	Session.remove({ session: { $regex: email } }, (err, doc) => {
		if (err) {
			throw new Error(err);
		}

		ctx.logout();
		console.log('You are now logged out on all browsers! 👋');
	});
}