var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;
var bcrypt = require('bcryptjs');
var Promise = require('bluebird');
var sanitizer = require('sanitizer');

mongoose.Promise = Promise;

var userSchema = new Schema ({
	email: String, 
	password: String,
	created_company_id: ObjectId, // _id
	belong_company_id: ObjectId,  // _id
	created: String, 
	updated: String,
	active: Boolean
});

userSchema.methods.isRegisteredAlready = function () {
	var User = this.model('User'); // get the model 
	var email = this.email;
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

userSchema.methods.isEmailValid = function () {
	if (this.email != sanitizer.sanitize(this.email)) {
		// dirty
		return false; 
	}

	if( /^\S+@\S+\.\S+$/.test(this.email)) {
			return true;
		} else {
			return false; 
	}	
}

userSchema.methods.isPasswordValid = function () {
	if(/^.{6,}$/.test(this.password)) {
			return true;
		} else {
			return false; 
		}
}

userSchema.methods.createUser = function () {
	// only safe to run after making sure it is new user, 
	// or it will overwrite existing user. 
	var userJson = this.toJSON();
	delete userJson._id;
	userJson.active = false;
	var User = this.model('User');

	var promise = new Promise(function(resolveFunc, rejectFunc) {
		bcrypt.hash(userJson.password, 8, function(err, hash) {
			if(err) {
				rejectFunc(err);
			} else {
				resolveFunc(hash);
			}
		});
	});
	return promise
		.then(function(hash) {
			userJson.password = hash;
			return User.update({email: userJson.email}, userJson, {upsert: true});
		})
} 

userSchema.methods.login = function () {
	// check valid before calling this method
	var userJson = {email: this.email, password: this.password};
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

