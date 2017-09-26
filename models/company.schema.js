/*
	After a company is created, go through database 
	and link email with clients of other companies and replace according private clients
*/
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;;
var Promise = require('bluebird');
var sanitizer = require('sanitizer');


mongoose.Promise = Promise;

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
	created: String,
	updated: String,
	invoiceEmails: [String], // notification email address
	members: [ObjectId], // contains all members, including the creator
	vendors: [ObjectId],
	clients: [ObjectId],
	templates: [ObjectId], // array of invoice template id
	active: Boolean, // set in active will not receive invoice and other request
	
	creatorCompanyId: ObjectId, 
										 // company who create this company, empty if it is active company
										 // creatorCompanyId will be empty if it is public company
										 // only private company have this set to creator company id
	public: Boolean   // true if it is created by user, not belong to other company
	/* use creatorCompanyId and public fields to determine if public company together */

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
	var userOid = new ObjectId(userId)
	
	companyJson.members = [userId];
	companyJson.active = true;
	companyJson.public = true;
	// Use object string string when type is ObjectId, the string will be coerced to Object ID in mongoDB,
	// if you use a object id type, which is a json object, there will be a validation error
	var invoiceTemplateId = '579572800d8bb41654d00b44' //new ObjectId('579572800d8bb41654d00b44') 
	// TODO: there could be 2 default invoice templates
	//       or premium user will have its own customized templates
	companyJson.templates = [invoiceTemplateId];
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

companySchema.statics.createClient = function (clientJson) {
	// 1. create a company record
	// 2. add newly created id to user's company client list
	// 3. return created client. 
	var Company = this.model('Company')
	var thisCompany = this

	return Company.create(clientJson)
		.then(function (client) {
			thisCompany.clients.push(client._id)
			return Company.findByIdAndUpdate(thisCompany._id, {clients: thisCompany.clients}, {new: true}) // new: true, return updated document
				.then (function (updatedCompany) {
					return {updatedCompanyModel: updatedCompany, createdClient: client}
				})
		})
}

companySchema.statics.createClientRequest = function (clientReqest) {
	/* request object {
		to_cid: '3232k3'
		from_cid: '43243243',
		from_cname: "abc company",
		status: "pending"
		created: "3232323232" // milli second
	}
	*/
	clientReqest.status = 'pending'
	clientReqest.created = new Date().getTime()
	var Company = this.model('Company')
	return Company.findByIdAndUpdate(clientReqest.to_cid, {$push: {clientRequestsReceived: clientReqest}}, {new: true})

}

companySchema.statics.createVendorRequest = function (vendorRequest) {
	/*
	{	
		to_cid: 'dfsfdsfds',
		from_cid: '43243243',
		from_cname: "abc company",
		status: "pending"
		created: "3232323232" // milli second
	}
	*/
	vendorRequest.status = 'pending'
	vendorRequest.created = new Date().getTime()
	var Company = this.model('Company')
	return Company.findByIdAndUpdate(vendorRequest.to_cid, {$push: {vendorRequestsReceived: vendorRequest}}, {new: true})
}

companySchema.statics.approveRejectClient = function (to_cid, from_cid, isApproved) {
	// validation should all be done in route

	if (isApproved) {
		// 1. add from_cid to to_cid vendor list

		// 2. add to_cid to from_cid client list

		// 3. return to_cid updated company document		
	} else {
		
	}
}

companySchema.statics.approveRejectVendor = function () {

}

companySchema.statics.getClients = function (clientIds) {
	var Company = this.model('Company');
	return Company.find({_id: {$in: clientIds}});
}

companySchema.statics.getVendors = function (vendorIds) {
	var Company = this.model('Company');
	return Company.find({_id: {$in: []}});

}

module.exports = companySchema;