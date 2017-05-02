const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');
const mongodbErrorHandler = require('mongoose-mongodb-errors');
const md5 = require('md5');

const userSchema = new Schema({
	email: {
		type: String,
		unique: true,
		lowercase: true,
		trim: true,
		required: 'Please supply an email address'
	},
	password: String
});

userSchema.virtual('gravatar').get(function() {
	const hash = md5(this.email);
	return `https://www.gravatar.com/avatar/${hash}?s=200`;
});

userSchema.pre('save', function(next) {
	bcrypt.genSalt(10, (err, salt) => {
		if (err) { 
			return next(err); 
		}

		bcrypt.hash(this.password, salt, null, (err, hash) => {
			if (err) {
				return next(err);
			}

			this.password = hash;
			next();
		});
	});
});

userSchema.methods.comparePassword = function(candidatePassword, callback) {
	bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
		if (err) {
			return callback(err);
		}

		callback(null, isMatch);
	});
}

userSchema.plugin(mongodbErrorHandler);

module.exports = mongoose.model('User', userSchema);
