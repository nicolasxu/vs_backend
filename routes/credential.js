var User = require('../models/').User;
var messages = require('./messages.js');
var _ = require('lodash');
var cors = require('cors');
var Company = require('../models').Company;

module.exports = {mountTo: mountRoutes};

function mountRoutes (router) {
	router.post('/credential', function (req, res, next) {

		var user = User({email: req.body.email, password: req.body.password});

		// 1. validate email
		if(!user.isEmailValid()) {
			res.status(200).json(messages.invalidEmail);
			return;
		}
		// 2. login
		user.login()
			.then(function(result) {
				return result;
			})
			.then(function(user) {
				if(!user) {
					res.status(200).json(messages.passwordNotMatch);
					return;
				}
				Company.findOne({members: {$in: [user._id]}})
					.then(function(myCompany){
						req.session.user = user;
						req.session.company = myCompany;
						req.session.authenticated = true;
						var copyMsg = _.cloneDeep(messages.userLoginSuccess);
						copyMsg.user = user;
						copyMsg.company = myCompany;
						res.status(200).json(copyMsg);
						return;
					});
			});
	});

	router.get('/credential', function(req, res, next){

		req.session.counter = 1;
		res.status(200).json({msg: "success"});
	});


	router.delete('/credential', function (req, res, next){
		req.session.authenticated = false;
		req.session.user = {};
		req.session.company = {};
		res.status(200).json(messages.userLogoutSuccess);
		
 
	});
}