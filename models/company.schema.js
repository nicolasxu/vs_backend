/*
	After a company is created, go through database 
	and link email with clients of other companies and replace according private clients
*/
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;;
var sanitizer = require('sanitizer');
let { GraphQLError } = require('graphql')
var mongoosePaginate = require('mongoose-paginate')


var companySchema = new Schema ({
	name: String,
	addressLine1: String,
	addressLine2: String,
	city: String,
	state: String,
	zip: String,
	country: String,
	tel: String,
	eid: String, // EID or SSN
	website: String,
	serviceDesc: String,
	created: String,
	updated: String,
	invoiceEmails: [String], // notification email address
	invoicePersonName: String, // person will be responsible for receiving and paying invoice in this company
	members: [ObjectId], // contains all members, including the creator
	vendors: [ObjectId],
	clients: [ObjectId],
	templates: [ObjectId], // array of invoice template id
	isActive: Boolean, // set inactive will not receive invoice and other request

	creatorCompanyId: ObjectId 
										 // company who create this company, empty if it is user creates its own company
										 
										 // only company created by other company have this set to creator company id
	//public: Boolean    // true if it is created by user, not belong to other company
	/* use creatorCompanyId and public fields to determine if public company together */
	// todo: remove this field
});

// Can only be used to create my own company, not client or vendor
companySchema.statics.createMyCompany = async function (companyJson) {

	if (!companyJson.members || companyJson.members.length < 1) {
		return
	}
	let userId = companyJson.members[0]

	// 1. check if user is in other company
	let isInOtherCompany = await this.isUserInOtherCompany(userId)

	if (isInOtherCompany) {
		return 'COMPANY EXIST'
	}

	// create company
	var Company = this.model('Company')
//	var userOid = new ObjectId(userId)
	
	// companyJson.members = [userId];
	companyJson.active = true;

	// Use object string string when type is ObjectId, the string will be coerced to Object ID in mongoDB,
	// if you use a object id type, which is a json object, there will be a validation error
	// debug
	var invoiceTemplateId = '579572800d8bb41654d00b44' //new ObjectId('579572800d8bb41654d00b44') 
	// TODO: there could be 2 default invoice templates
	//       or premium user will have its own customized templates
	companyJson.templates = [invoiceTemplateId];

	// create my own company, the creatorCompanyId must be null
	companyJson.creatorCompanyId = null
	
	return Company.create(companyJson)
}

companySchema.statics.isNameValid = function () {
	// sanitize it first
	this.name = sanitizer.sanitize(this.name);

	if (this.name && this.name.length > 0) {
		return true;
	} else {
		return false; 
	}
}

companySchema.statics.isUserInOtherCompany = async function (userId) {
	// determine if the current session user is in other company
	var userOid = mongoose.Types.ObjectId(userId)

	var Company = this.model('Company')

	let myCompany = await Company.findOne({members: {'$in': [userOid] }})

	if (myCompany) {
		return true
	} else {
		return false
	}
}

companySchema.statics.getClients = async function (myCompanyId, offset, limit) {

	if (!myCompanyId) {
		return []
	}
	let Company = this.model('Company')

	// 1. find my company
	let myCompany = await Company.findOne({_id: myCompanyId})


	let clientIds = myCompany.clients
	return Company.paginate({_id: {'$in': clientIds}}, {offset: offset, limit: limit, lean: true} )
}

companySchema.statics.getVendors = async function (myCompanyId, offset, limit) {

	if (!myCompanyId) {
		return []
	}
	let Company = this.model('Company')

	// 1. find my company
	let myCompany = await Company.findOne({_id: myCompanyId})

	let vendorIds = myCompany.vendors

	let vendors = await Company.paginate({_id: {'$in': vendorIds}}, {offset: offset, limit: limit, lean: true})

	return vendors
}

companySchema.statics.getMyClientDetail = async function (userId, clientId) {

  let Company = this.model('Company')

  // 1. make sure it is my client
  let myCompany = await Company.findOne({members: {'$in': [userId]}, clients: {'$in': [clientId]}})

  if (!myCompany) {
  	return null
  }
  // 2. find company and return detail
  let clientDetail = await Company.findOne({_id: clientId})

  return clientDetail
}

companySchema.statics.getMyVendorDetail = async function (userId, vendorId) {

	let Company = this.model('Company')

  // 1. make sure it is my client
  let myCompany = await Company.findOne({members: {'$in': [userId]}, vendors: {'$in': [vendorId]}})

  if (!myCompany) {
  	return null
  }

  let vendorDetail = await Company.findOne({_id: vendorId})

  return vendorDetail

}

companySchema.statics.findUserCompany = async function(userId) {
	if (!userId) {
		return null
	}

	let Company = this.model('Company')

	return Company.findOne({members: {'$in': [userId]}, creatorCompanyId: null }).lean()
}

companySchema.statics.addClient = async function(toCid, clientId ) {

	if(!toCid || !clientId) {
		return null
	}

	let Company = this.model('Company')

	return Company.findOneAndUpdate({_id: toCid}, {$push: {clients: clientId}}, {upsert: false, new: true})
}

companySchema.statics.addVendor = async function (toCid, vendorId) {
	if(!toCid || !vendorId) {
		return null
	}

	let Company = this.model('Company')

	return Company.findOneAndUpdate({_id: toCid}, {$push: {vendors: vendorId}}, {upsert: false, new: true})
}


companySchema.plugin(mongoosePaginate)
module.exports = companySchema;