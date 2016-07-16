var User = require('../models/').User;
var messages = require('./messages.js');
var _ = require('lodash');

module.exports = {mountTo: mountRoutes};

function mountRoutes (router) {
	router.post('/credential', function (req, res, next) {

		var user = User({email: req.body.email, password: req.body.password});

		// 1. validate email
		if(!user.isEmailValid()) {
			res.set('Access-Control-Allow-Credentials','true').json(messages.invalidEmail);
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
					res.set('Access-Control-Allow-Credentials','true').status(200).json(copyMsg);
					return;
				}
				if(result === false) {
					res.set('Access-Control-Allow-Credentials','true').json(messages.passwordNotMatch);
					return;
				}
			});
	});

	router.get('/credential', function(req, res, next){

		req.session.counter = 1;
		res.set('Access-Control-Allow-Credentials','true').json({msg: "success"});
	});

	router.delete('/credential', function (req, res, next){
		req.session.authenticated = false;
		req.session.user = {};
		console.log('removing session data...');
		console.log('sessionId: ' + req.sessionID);
		res.set('Access-Control-Allow-Credentials','true').json(messages.userLogoutSuccess);
		

	});
}