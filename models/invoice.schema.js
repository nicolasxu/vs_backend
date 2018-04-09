var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

var companySchema = require('./company.schema.js');
var Company = mongoose.model('Company', companySchema);
var mongoosePaginate = require('mongoose-paginate')


var invoiceSchema = new Schema ({
	fromCompany: {
		cid: ObjectId, // company id of sender company
		cName: String, // sender company name
		uid: ObjectId, // user id who is sending this invoice
		uName: String
	},
	toCompany: {
		cid: ObjectId, // company id of receiver company
		cName: String  // receiver company name
	},
	invoiceNumber: String,
	amount: Number, 
	sentDate: Number,
	dueDate: Number,
	term: String,
	renderedInvoice: String, // contain html and style for rendered invoice
	status: String, // 'generated'(sent/received), 'voided', 'rejected', 
	viewed: Boolean,
	paymentStatus: String, // 'not', 'failed', 'pending', 'paid'
	transactionId: String, 
	paidDate: Number,
});



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

invoiceSchema.methods.fillInvoiceNumber = function () {
	var thisInvoice = this;
	var Invoice = this.model('Invoice');
	console.log('from cid:' + thisInvoice.from.cid);
	var option = {};
	option["from.cid"] = thisInvoice.from.cid;
	return Invoice.count(option)
		.then(function (count, err) {
			console.log('count is: ' + count);
			console.log('err is: ' + err);
			if(err) {
				return false;
			}
			if(!count) {
				count = 1;
			}
			thisInvoice.invoiceNumber = count + 1;
			return true; 
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
	
	return Invoice.find(option)
		.select('from to invoiceNumber status amount sendDate dueDate isPaid paidDate paidAmount')
		.skip(pageSize * pageOffset)
		.limit(pageSize);
}

invoiceSchema.plugin(mongoosePaginate)
module.exports = invoiceSchema;
