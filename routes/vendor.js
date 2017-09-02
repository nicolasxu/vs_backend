var messages = require('./messages.js');
var Company = require('../models/index.js').Company;
var _ = require('lodash');
var Template = require('../models/index.js').Template;
module.exports = {mountTo: mountRoutes }

function mountRoutes(router) {
	router.get('/vendor', function (req, res, next) {

		/*
		test

		*/

		var tpl = new Template({
			name: 'template 1',
			html: '<h1 id="tpl-headline"> this is template 1</h1',
			css: '#tpl-headline: background-color: yellow',
			js:' console.log("js from template")'
		})
		tpl.save();

		/////////////////



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
				msgJson.data.vendors = vendors;
				res.status(200).json(msgJson);
			})
			.catch(function(err) {
				// do sth with possible error.
				console.log(err);
			});
	});
}