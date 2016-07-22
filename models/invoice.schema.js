var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;;
var Promise = require('bluebird');
var sanitizer = require('sanitizer');
mongoose.Promise = Promise;
var companySchema = require('./company.schema.js');
var Company = mongoose.model('Company', companySchema);


var invoiceSchema = new Schema ({
	from: {
		cid: ObjectId, // company id of sender company
		cName: String, // sender company name
		uid: ObjectId, // user id who is sending this invoice
		uEmail: String,// email of the user
		uName: String
	},
	to: {
		cid: ObjectId, // company id of receiver company
		cName: String  // receiver company name

	},  
	amount: Number, 
	sendDate: String,
	dueDate: String,
	invoiceRender: String, // contain html and style for rendered invoice
	isPaid: Boolean, // is fully paid
	paidDate: String,
	paidAmount: Number, // invoice can be partially paid
	settled: Boolean // invoice can be partilly paid and settled
									 // e.g.: $100 amount, paid $25, then it is settled. 
});

module.exports = invoiceSchema;

invoiceSchema.methods.isReceiverIdValid = function () {
	var idRegex = /^[0-9a-fA-F]{24}$/;
	// this.to.cid is ObjectId, not string
	if(!this.to.cid.toString().match(idRegex)) { 
		return false; 
	}

	return true; 
}

invoiceSchema.methods.fillFrom = function (user) {
	
	var thisInvoice = this;
	if(!this.from) {
		this.from = {};
	}

	this.from.uid = user._id;

	if(!this.from.uEmail) {
		this.from.uEmail = user.email;
	}
	if(user.name) {
		this.from.uName = user.name;
	}

	return Company.findOne({members: {$in: [user._id]}})
		.then(function(myCompany) {
			thisInvoice.from.cid = myCompany._id;
			thisInvoice.from.cName = myCompany.name;
		});

}

invoiceSchema.methods.fillTo = function () {
	var thisInvoice = this;
	return Company.findById(this.to.cid)
		.then(function(toCompany){
			if(toCompany) {
				thisInvoice.to.cName = toCompany.name;
				return true; 
			} else {
				return false; 
			}
		});
}

invoiceSchema.methods.send = function () {
	return this.save();
}

invoiceSchema.methods.getList = function (searchOption, pageSize, pageOffset, session) {

	var Invoice = this.model('Invoice');
	var cid = session.company._id;

	var option = {};
	if(searchOption.sent === true) {

		option["from.cid"] = cid;
	} else {

		option["to.cid"] = cid;
	}
	console.log(option);
	return Invoice.find(option)
		.select('from to amount sendDate dueDate isPaid paidDate paidAmount settled')
		.skip(pageSize * pageOffset)
		.limit(pageSize);


}





















