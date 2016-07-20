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
			
			},
			to: {
				cid: '5783ce6d08ab45f80fb2090e', // required
			}, 
			amount: 1234.58, // required
			dueDate: '1470888000000', // Aug 11, required
			isPaid: false,  // server will fill it if not present
			settled: false, // no need to send to server
			invoiceRender: '<h3>You own me $1234.58, due on Aug 11, 2016</h3>' // required
		}
		var jj = JSON.stringify(requestExample);
		// you can use jj in advanced client request

		var invoiceJson = {};
		if(req.body.from) {
			invoiceJson.from = req.body.from;
		}
		invoiceJson.amount = req.body.amount;
		invoiceJson.to = req.body.to;
		
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

	router.get('/invoice/sent', checkLogin, function (req, res, next){
		// Only support 'offset' in the query string
		/*
		// GET /search?q=tobi+ferret
		req.query.q
		// => "tobi ferret"
		*/

		var pageSize = 50;

		var pageOffset = 0;
		var qPageOffset = parseInt(req.query.offset);
		if(qPageOffset.toString() !== "NaN") {
			if(qPageOffset > 0) {
				pageOffset = qPageOffset;
			}
		}

		var invoice = new Invoice();
		invoice.getList({sent: true } ,pageSize, pageOffset, req.session)
			.then(function(results){
				console.log(results);
				var msgJson = _.cloneDeep(messages.getInvoiceListSuccess);
				msgJson.invoices = results;
				res.status(200).json(msgJson);
			});
	});

	router.get('/invoice/received', function(req, res, next) {

	});


} 