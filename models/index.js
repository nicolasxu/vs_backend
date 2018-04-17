const mongoose = require('mongoose');
const userSchema = require('./user.schema.js');
const companySchema = require('./company.schema.js');
const invoiceSchema = require('./invoice.schema.js');
const invoiceTemplateSchema = require('./template.schema.js');
const requestSchema = require('./request.schema.js')
const productSchema = require('./product.schema.js')
const planSchema = require('./plan.schema.js')
// the logic of mongoose is:
//   1. use new Schema({}) to create a schema
//   2. use mongoose.model('ModelName', schema) to create Model
//   3. use result of "new Model" (is called document)to save, update data
//      use Model.find() to search


const Models = {
	User: mongoose.model('User', userSchema),
	Company: mongoose.model('Company', companySchema),
	Invoice: mongoose.model('Invoice', invoiceSchema),
	Template: mongoose.model('Template', invoiceTemplateSchema),
  Request: mongoose.model('Request', requestSchema),
  Product: mongoose.model('Product', productSchema),
  Plan: mongoose.model('Plan', planSchema)
}

module.exports = Models;


