const passport = require('passport');
const User = require('../models/User');
const validator = require('validator');

passport.use(User.createStrategy());

// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

const signin = (req, res) => {
	passport.authenticate('local', (err, user) => {
		if (!user) {
			return res.status(422).send({ error: 'Email/Password incorrect' }); 
		}

		res.send(user);
	})(req, res);
}

const signup = (req, res, next) => {
	const { email, password } = req.body;

	if (validator.isEmpty(email)) {
		return res.status(422).send({ error: 'Email Address cannot be empty' });
	}

	if (!validator.isEmail(email)) {
		return res.status(422).send({ error: 'Invalid Email Address' });
	}

	if (validator.isEmpty(password)) {
		return res.status(422).send({ error: 'Password cannot be empty' });
	}

	const user = new User({ email });

	User.register(user, password, (err) => {
		if (err) {
			return res.status(422).send({ error: err.message });
		}

		next();
	});
};

module.exports = app => {
		// Passport JS is what we use to handle our logins
	app.use(passport.initialize());
	app.use(passport.session());

	app.post('/signin', signin);

	app.post('/signup', signup, signin);

	app.get('/logout', (req, res) => {
		req.logout();
		res.redirect('/');
	});
}