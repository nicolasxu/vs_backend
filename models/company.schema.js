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
	creator: ObjectId,
	created: String,
	updated: String,
	emails: [String], // notification email address
	members: [ObjectId], // contains all members, including the creator
	
	vendors: [ObjectId],
	clients: [ObjectId],
	templates: [ObjectId], // array of invoice template id
	active: Boolean, // set in active will not receive invoice and other request
	public: Boolean,  // company created by real user are public company, 
									 // or it is private, cannot be searched, added to client or vendor
	clientRequestsReceived: [{}],
	vendorRequestsReceived: [{}]
});


companySchema.methods.isNameValid = function () {
	// sanitize it first
	this.name = sanitizer.sanitize(this.name);

	if (this.name && this.name.length > 0) {
		return true;
	} else {
		return false; 
	}
}

companySchema.methods.isUserInOtherCompany = function (userId) {
	// determine if the current session user is in other company
	var userOid = mongoose.Types.ObjectId(userId);

	var Company = this.model('Company');
	return Company.findOne({members: {'$in': [userOid]}})
		.then(function(result) {
			if(result) {
				return true;
			} else {
				return false; 
			}
		})
}

companySchema.methods.createCompany = function (userId) {
	// create company
	var companyJson = this.toJSON();
	var userOid = mongoose.Types.ObjectId(userId);
	var Company = this.model('Company');
	companyJson.members = [userOid];
	companyJson.creator = userOid;
	companyJson.active = true;
	companyJson.public = true;
	var invoiceTemplateId = mongoose.Types.ObjectId('579572800d8bb41654d00b44'); 
	// TODO: there could be 2 default invoice templates
	//       or premium user will have its own customized templates
	companyJson.templates = [invoiceTemplateId];
	return Company.create(companyJson);
	
}
companySchema.statics.addClient = function (userCompanyId, clientId) {
	// add clientId to be the client of user company
	// 1. create request records, 
	//
}

companySchema.methods.createClientRequest = function (clientReqest) {
	/* request object {
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

companySchema.statics.createVendorRequest = function (to_id, from_id) {

}

companySchema.statics.approveRejectClient = function () {

}

companySchema.statics.approveRejectVendor = function () {

}

companySchema.methods.createClient = function (clientJson) {
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



companySchema.methods.createClient__ = function (userId) {
	// 1. get current user's company
	var Company = this.model('Company');
	var clientJson = this.toJSON();
	var myCompany = '';
	return Company.findOne({members: {$in: [userId]}})
		.then(function(myCompanyResult) {
			// my company exists
			clientJson.vendors = [myCompanyResult._id];
			myCompany = myCompanyResult;
			clientJson.creator = userId;
			clientJson.active = true;
			return Company.create(clientJson);
		})
		.then(function(clientCompanyResult) {
			myCompany.clients.push(clientCompanyResult._id);
			return myCompany.save(function(err, company) {
				return company;
			});
		});
}

companySchema.methods.getClients = function (clientIds) {
	var Company = this.model('Company');
	return Company.find({_id: {$in: clientIds}});
}

companySchema.methods.getVendors = function (vendorIds) {
	var Company = this.model('Company');
	return Company.find({_id: {$in: []}});

}



module.exports = companySchema;