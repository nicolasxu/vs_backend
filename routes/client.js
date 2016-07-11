var messages = require('./messages.js');
var Company = require('../models/index.js').Company;
var _ = require('lodash');
var checkLogin = require('./checkLogin.js');

module.exports = {mountTo: mountRoutes};

function mountRoutes(router) {
	router.get('/client', checkLogin, function(req, res, next){
		// list all clients
	});

	router.post('/client', checkLogin, function(req, res, next){
		// create a new client
		var company = new Company({name: req.body.name, emails: req.body.emails});
		company.createClient(req.session.user._id)
			.then(function(company) {
				if(company) {
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