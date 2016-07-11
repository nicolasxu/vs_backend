
var User = require('../models').User;
var messages = require('./messages.js');

module.exports = {mountTo: mountRoutes};

function mountRoutes (router) {

	router.post('/user', function (req, res, next){

		var user = new User ({email: req.body.email, password: req.body.password});

		// 1. validate email
		if(!user.isEmailValid()) {
			res.status(200).json(messages.invalidEmail);
			return;
		}
		// 2. validate password
		if(!user.isPasswordValid()) {
			res.status(200).json(messages.weakPassword);
			return;
		}

		// 3. validate unique email
		user.isRegisteredAlready()
			.then(function (isRegistered)  {
				if(isRegistered) {
					res.status(200).json(messages.accountExist);
				} else {
					user.createUser()
						.then (function(result) {
							
								res.status(200).json(messages.createUserSuccess);
								return;
							}
						)
				}
			});
	});

	router.get('/user', function (req, res, next) {
		res.status(200).json({message: "get /user success"});
	})
}
