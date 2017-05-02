const passport = require('passport');
const User = require('./models/User');
const LocalStrategy = require('passport-local');
const {
	Strategy: JWTStrategy,
	ExtractJwt
} = require('passport-jwt');

const localOptions = {
	usernameField: 'email'
};

const localLogin = new LocalStrategy(localOptions, (email, password, done) => {
	User.findOne({
		email
	}, (err, user) => {
		if (err) {
			return done(err);
		}

		if (!user) {
			return done(null, false);
		}

		user.comparePassword(password, (err, isMatch) => {
			if (err) {
				return done(err);
			}

			if (!isMatch) {
				return done(null, false);
			}

			return done(null, user);
		});
	});
});

const JWTOptions = {
	jwtFromRequest: ExtractJwt.fromHeader('authorization'),
	secretOrKey: 'Meow!'
};

const JWTLogin = new JWTStrategy(JWTOptions, (payload, done) => {
	User.findById(payload.id, (err, user) => {
		if (err) {
			return done(err, false);
		}

		if (!user) {
			return done(null, false);
		}

		done(null, user);
	});
});

passport.serializeUser((user, done) => {
	console.log('serializing:', user);
	done(null, user.id);
});

passport.deserializeUser((user, done) => {
	console.log('deserializing', user);
	done(null, user);
});

passport.use(JWTLogin);
passport.use(localLogin);