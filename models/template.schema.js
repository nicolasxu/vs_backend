// invoice template

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;
var bcrypt = require('bcryptjs');
var Promise = require('bluebird');
var sanitizer = require('sanitizer');
var mongoosePaginate = require('mongoose-paginate')

mongoose.Promise = Promise;


var templateSchema = new Schema ({
	name: String, 
	html: String,
	css: String, 
	js: String,  
	created: String, 
	updated: String,
	active: Boolean
});


templateSchema.plugin(mongoosePaginate)

module.exports = templateSchema;



