var messages = require('./messages.js');
var _ = require('lodash');
var checkLogin = require('./checkLogin.js');
var Template = require('../models/').Template;
module.exports = {mountTo: mountRoutes };

function mountRoutes (router) {
	router.get('/template', checkLogin, function(req, res, next) {
		var tplIds = req.session.company.templates;

		if(!tplIds || !tplIds.length ) {
			// if no templates, or template no contents, then error
			res.status(200).json(messages.companyTemplateEmpty);
		}

		// use template Model to get templates
		Template.find({_id: {$in: tplIds}})
			.then(function(templates) {
				var jsonMsg = _.cloneDeep(messages.getTemplatesSuccess);
				jsonMsg.data.templates = templates;
				res.status(200).json(jsonMsg); 
			});
	});
}