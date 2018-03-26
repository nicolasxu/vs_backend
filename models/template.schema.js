// invoice template

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;
var bcrypt = require('bcryptjs');
var Promise = require('bluebird');
var sanitizer = require('sanitizer');
var mongoosePaginate = require('mongoose-paginate')




var templateSchema = new Schema ({
	name: String, 
	html: String,
	css: String, 
	js: String,
  active: Boolean,
  isDefault: Boolean,
	created: String, 
	updated: String
	
});

/*

ids is array of object id

*/
templateSchema.statics.getByIds = function (ids) {
  if (!Array.isArray(ids)) {
    return []
  }

  let Template = this.model('Template')

  return Template.find({
    '_id': {$in: ids}
  })

}


templateSchema.plugin(mongoosePaginate)

module.exports = templateSchema























