var messages = require('./messages.js');
// var Company = require('../models/index.js').Company;
var _ = require('lodash');
var checkLogin = require('./checkLogin.js');
var Invoice = require('../models/index.js').Invoice;

module.exports = {mountTo: mountRoutes};


function mountRoutes(router) {
	router.get('/invoice', checkLogin, function(req, res, next){
		// get invoices based on query string
	});

	router.post('/invoice', checkLogin, function(req, res, next) {
		// send invoice

		// example request:
		var requestExample = {
			from: {
				cid: '5783cde408ab45f80fb2090d', // no need to send to server, server will fill it
				cName: 'my own company', // no need to send to server, server will fill it
				uid: '5783caf2aeb2e9e8b7d2cc1c', // no need to send to server, server will fill it
				uEmail: 'xu.shenxin@gmail.com', // if not present, server will fill it
				uName: '' // no need to send to server
			},
			to: {
				cid: '5783ce6d08ab45f80fb2090e', // required
				cName: 'client no 1' // no need to send to server, server will fill it
			}, 
			amount: 1234.58, // required
			sendDate: '1468257963013', // July 11, required
			dueDate: '1470888000000', // Aug 11, required
			isPaid: false,  // server will fill it if not present
			settled: false, // no need to send to server
			invoiceRender: '<h3>You own me $1234.58, due on Aug 11, 2016</h3>' // required
		}
		var jj = JSON.stringify(requestExample);
		var invoiceJson = {};
		if(req.body.from) {
			invoiceJson.from = req.body.from;
		}
		invoiceJson.amount = req.body.amount;
		invoiceJson.to = req.body.to;
		invoiceJson.sendDate = req.body.sendDate;
		invoiceJson.dueDate = req.body.dueDate;
		invoiceJson.invoiceRender = req.body.invoiceRender;
		if(typeof req.body.isPaid === 'boolean') {
			invoiceJson.isPaid = req.body.isPaid;
		}

		var invoice = new Invoice(invoiceJson);
		if(!invoice.isReceiverIdValid()) {
			res.status(200).json(messages.companyIdNotValid);
			return;
		}


		// step 1: fill in 'from' from user obj in session
		invoice.fillFrom(req.session.user)
			.then(function(){
				return invoice.fillTo();
			})
			.then(function(isFilled){
				if(isFilled) {
					
					return true; 
				} else {
					// no to company found, to.cid is wrong
					res.status(200).json(messages.toCompanyIdNotValid);
					throw new Error();
				}	
			})
			.then(function(){
				// save invoice
				return invoice.send();
			})
			.then(function(sendResult){
				console.log(sendResult);
				res.status(200).json(messages.sendInvoiceSuccess);
				return;
			})
			.catch(function(){});

		// step 2: fill 


		
	});
} 