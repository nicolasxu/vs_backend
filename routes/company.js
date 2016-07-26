var messages = require('./messages.js');
var Company = require('../models/index.js').Company;
var _ = require('lodash');
module.exports = {mountTo: mountRoutes};
var checkLogin = require('./checkLogin.js');
function mountRoutes(router) {
	router.post('/company', checkLogin, function (req, res, next){
		// for creating user's own company only 
		var company = new Company({name: req.body.name, emails: req.body.emails });

		// 1. check if user created company already
		//    user is login already, get user._id from session
		company.isUserInOtherCompany(req.session.user._id)
			.then(function(isInOtherCompany){
				if(isInOtherCompany === false ) {
					return company.createCompany(req.session.user._id)
						.then(function (result) {

							// result contains the company created. 
							var msgJson = _.cloneDeep(messages.createCompanySuccess);
							msgJson.company = result;
							res.status(200).json(msgJson);
						});	
				} else {
					res.status(200).json(messages.userHasCompanyAlready);
					return;
				}
			})
	});

	router.put('/company', checkLogin, function (req, res, next) {
		// change name, and other things
		// mark inactive, no deletion. 
	});

	router.get('/company', checkLogin, function (req, res, next) {
		// var userId = mongoose.Types.ObjectId();
		Company.findOne({members: {$in: [req.session.user._id]}})
			.then(function(myCompany) {
				// console.log(myCompany);
				var jsonResult = _.cloneDeep(messages.getCompanySuccess);
				jsonResult.company = myCompany;
				console.log(jsonResult);
				res.status(200).json(jsonResult);
			});
	});

	router.get('/company/alive', checkLogin, function(req, res, next) {
		// search all alive companies
	})

	router.delete('/company', checkLogin, function (req, res, next) {
		//
	});
}