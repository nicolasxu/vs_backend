var messages = require('./messages.js');
var Company = require('../models/index.js').Company;
var _ = require('lodash');
var checkLogin = require('./checkLogin.js');

module.exports = {mountTo: mountRoutes};

function mountRoutes(router) {
	router.get('/client', checkLogin, function(req, res, next){
		// list all clients
		var myCid = req.session.company && req.session.company._id;

		if(!myCid) {
			// my company doesn't exist
			res.status(200).json(messages.myCompanyNotExist);
			return;
		}

		var company = new Company();
		company.getClients(req.session.company.clients)
			.then(function (clients) {
				var msgJson = _.cloneDeep(messages.getClientsSuccess);
				msgJson.clients = clients;

				res.status(200).json(msgJson);
			});
	});

	router.post('/client', checkLogin, function(req, res, next){
		// create a new client
		var company = new Company({name: req.body.name, emails: req.body.emails});
		company.createClient(req.session.user._id)
			.then(function(company) {
				if(company) {
					// 1. update session
					req.session.company = company;
					// 2. compile and send result
					var messageJson = _.cloneDeep(messages.createClientSuccess);
					messageJson.company = company;
					res.status(200).json(messageJson); 
				} else {
					res.status(200).json(messages.createClientError);
				}
			});
	});

	router.post('/client/request', checkLogin, function(req, res, next){
		// send request
	});

	router.put('/client/request', checkLogin, function(req, res, next) {
		// approve, or deny request
	})
}