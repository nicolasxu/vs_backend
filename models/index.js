var mongoose = require('mongoose');
var userSchema = require('./user.schema.js');
var companySchema = require('./company.schema.js');
var invoiceSchema = require('./invoice.schema.js');
var invoiceTemplateSchema = require('./template.schema.js');
var requestSchema = require('./request.schema.js')
// the logic of mongoose is:
//   1. use new Schema({}) to create a schema
//   2. use mongoose.model('ModelName', schema) to create Model
//   3. use result of "new Model" (is called document)to save, update data
//      use Model.find() to search


var Models = {
	User: mongoose.model('User', userSchema),
	Company: mongoose.model('Company', companySchema),
	Invoice: mongoose.model('Invoice', invoiceSchema),
	Template: mongoose.model('Template', invoiceTemplateSchema),
  Request: mongoose.model('Request', requestSchema)
}

module.exports = Models;


