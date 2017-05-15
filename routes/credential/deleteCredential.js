var User = require('../../models/').User;
var _ = require('lodash');
var cors = require('cors');
var Company = require('../../models').Company;
var messages = require('../messages.js');

module.exports = deleteCredential

function deleteCredential(req, res, next) {
    req.session.authenticated = false;
    req.session.user = {};
    req.session.company = {};
    res.status(200).json(messages.userLogoutSuccess);
}