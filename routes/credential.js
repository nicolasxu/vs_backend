var User = require('../models/').User;
var messages = require('./messages.js');
var _ = require('lodash');
var cors = require('cors');
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
				if(result) {
					// if login success, result contains the user details json,
					// or result is false
					var copyMsg = _.cloneDeep(messages.userLoginSuccess);
					copyMsg.user = result;
					req.session.user = result;
					req.session.authenticated = true; 
					res.status(200).json(copyMsg);
					return;
				}
				if(result === false) {
					res.status(200).json(messages.passwordNotMatch);
					return;
				}
			});
	});

	router.get('/credential', function(req, res, next){

		req.session.counter = 1;
		res.status(200).json({msg: "success"});
	});


	router.delete('/credential', function (req, res, next){
		req.session.authenticated = false;
		req.session.user = {};
		res.status(200).json(messages.userLogoutSuccess);
		
 
	});
}