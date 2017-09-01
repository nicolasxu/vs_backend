var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;
var bcrypt = require('bcryptjs');
var Promise = require('bluebird');
var sanitizer = require('sanitizer');
var _ = require('lodash')

mongoose.Promise = Promise;

var userSchema = new Schema ({
	email: String, 
	password: String,
	role: String,
	active: Boolean,
	firstName: String,
	lastName: String,
	updatedAt: String,
});

userSchema.statics.isRegisteredAlready = function (user) {
	var User = this.model('User'); // get the model 
	var email = user.email;
	var isRegistered = false; 

	var promise = new Promise(function(resolveFunc, rejectFunc){
		User.find({email: email, active: true})
			.then(function(docs, err){
				if(err) {
					rejectFunc(err);
				} else {
					if(docs.length > 0) {
						isRegistered = true;
					}
					resolveFunc(isRegistered);
				}
			});
	});

	return promise;
}

userSchema.statics.isEmailValid = function (email) {
	if (email != sanitizer.sanitize(email)) {
		// dirty
		return false; 
	}

	if( /^\S+@\S+\.\S+$/.test(email)) {
			return true;
		} else {
			return false; 
	}	
}

userSchema.statics.isPasswordValid = function (password) {
	if(/^.{6,}$/.test(password)) {
			return true;
		} else {
			return false; 
		}
}

userSchema.statics.createUser = function (userInput) {
	// only safe to run after making sure it is new user, 
	// or it will overwrite existing user.
	var user = _.clone(userInput)
	delete user._id;
	user.active = false;
	var User = this.model('User');

	var promise = new Promise(function(resolveFunc, rejectFunc) {
		bcrypt.hash(user.password, 8, function(err, hash) {
			if(err) {
				rejectFunc(err);
			} else {
				resolveFunc(hash);
			}
		});
	});
	return promise
		.then(function(hash) {
			user.password = hash;
			return User.update({email: user.email}, user, {upsert: true});
		})
		// todo: find newly created user, 
		//       return user record without password
} 

userSchema.statics.login = function (user) {
	// check valid before calling this method
	var userJson = {email: user.email, password: user.password};
	// TODO: find user in database first
	var User = this.model('User');
	return User.findOne({email:userJson.email})
		.then(function(oneUser) { 
			if(!oneUser) {
				return false; 
			}
			var promise = new Promise(function(resolve, reject) {
				bcrypt.compare(userJson.password, oneUser.password, function(err, res) {
					if(err) {
						reject(err);
					} else {
						if(res === true) {
							var resultJson = oneUser.toJSON();
							// have to convert to JSON, so that delete will work
							delete resultJson.password;

							resolve(resultJson);
						} else {
							resolve(false);
						}
					}
				});
			});
			return promise;
		});
}

module.exports = userSchema;

