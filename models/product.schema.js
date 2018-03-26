// product/service template

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;
var bcrypt = require('bcryptjs');

var sanitizer = require('sanitizer');
var mongoosePaginate = require('mongoose-paginate')

let productSchema = new Schema ({
  companyId: String,
  description: String,
  price: Number,
  shortCode: { type: String, unique: true},
  created: String,
  updated: String
})


productSchema.statics.findByDescription = function (desc) {

}

productSchema.statics.findByShortCode = function (sc) {

}

// find by description and short code combined
productSchema.statics.findByAll = function (str) {

}

productSchema.plugin(mongoosePaginate)

module.exports = productSchema