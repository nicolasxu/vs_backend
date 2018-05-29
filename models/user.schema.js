var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;
var bcrypt = require('bcryptjs');
var sanitizer = require('sanitizer');
var _ = require('lodash')
const generateSafeId = require('generate-safe-id');
var mongoosePaginate = require('mongoose-paginate')


var userSchema = new Schema ({
	email: String, 
	password: String,
	companyName: String,
	myCompanyId: ObjectId, // one user can only belong to one company only,
	                     // after success email verification, a company is created automatically
	role: String,
	active: Boolean,
	firstName: String,
	lastName: String,
	emailVerifyHash: String,
	resetPwdHash: String,
	resetPwdHashTime: String, 
	updatedAt: String,
	createdAt: String
});

userSchema.statics.isRegistered = async function (email) {
	var User = this.model('User'); // get the model 
	
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
	console.log('create user is called...')
	// only safe to run after making sure it is new user, 
	// or it will overwrite existing user.
	var user = _.clone(userInput)
	delete user._id;
	user.active = false;
	var User = this.model('User');

	let hash = await bcrypt.hash(user.password, 8)
	user.password = hash
	user.emailVerifyHash = generateSafeId()
	return User.update({email: user.email}, user, {upsert: true, new: true})
}

userSchema.methods.updatePwd = async function (newPwd) {
	let hash = await bcrypt.hash(newPwd, 8)
	this.password = hash
}

userSchema.statics.verifyEmail = async function(input) {
	let email = input.email
	let hash = input.hash

	const User = this.model('User')

	return User.findOneAndUpdate(
		{email: email, active: false, emailVerifyHash: hash }, 
		{$set: {active: true, emailVerifyHash: ''}}, 
		{new: true, upsert: false}
	)

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

