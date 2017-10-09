var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;
var bcrypt = require('bcryptjs');
var Promise = require('bluebird');
var sanitizer = require('sanitizer');
var _ = require('lodash')
var mongoosePaginate = require('mongoose-paginate')

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

userSchema.statics.isRegisteredAlready = async function (user) {
	var User = this.model('User'); // get the model 
	var email = user.email;
	var isRegistered = false; 

	var docs = await User.find({email: email, active: true})
	// doc is empty array if no found, or it will be an array with more than 0 item

	if (docs.length === 0) {
		return false
	} else {
		return true
	}
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

userSchema.statics.createUser = async function (userInput) {
	// only safe to run after making sure it is new user, 
	// or it will overwrite existing user.
	var user = _.clone(userInput)
	delete user._id;
	user.active = false;
	var User = this.model('User');

	let hash = await bcrypt.hash(user.password, 8)
	user.password = hash
	return User.update({email: user.email}, user, {upsert: true})
}

userSchema.statics.login = async function (user) {
	// check valid before calling this method
	var userJson = {email: user.email, password: user.password};
	// find user in database first
	var User = this.model('User')

	let oneUser = await User.findOne({email:userJson.email, active: true})
	// oneUser is null if not found

	if (!oneUser) {
		return false
	}

	let isPwdRight = await bcrypt.compare(userJson.password, oneUser.password)

	if (!isPwdRight) {
		return false
	}

	let oneUserJson = oneUser.toJSON()
	delete oneUserJson.password
	return oneUserJson
	// don't deal token here
}

userSchema.statics.findActiveUserByEmail = async function (email) {

	if (!email) {
		return null
	}

	let User = this.model('User')

	let oneUser = User.findOne({email: email, active: true}).lean()

	delete oneUser.password

	return oneUser

}

userSchema.plugin(mongoosePaginate)
module.exports = userSchema;

