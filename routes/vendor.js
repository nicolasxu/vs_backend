var messages = require('./messages.js');
var Company = require('../models/index.js').Company;
var _ = require('lodash');
var checkLogin = require('./checkLogin.js');

module.exports = {mountTo: mountRoutes }

function mountRoutes(router) {
	router.get('/vendor', checkLogin, function (req, res, next) {

		var myCid = req.session.company && req.session.company._id;

		if(!myCid) {
			// my company doesn't exist
			res.status(200).json(messages.myCompanyNotExist);
			return;
		}

		var company = new Company();
		company.getVendors(req.session.company.vendors)
			.then(function (vendors) {
				var msgJson = _.cloneDeep(messages.getVendorsSuccess);
				msgJson.vendors = vendors;
				res.status(200).json(msgJson);
			})
			.catch(function(err) {
				// do sth with possible error.
				console.log(err);
			});
	});
}