var User = require('../../models/').User;
var _ = require('lodash');
var cors = require('cors');
var Company = require('../../models').Company;
var messages = require('../messages.js');

module.exports = getCredential

function getCredential(req, res, next) {
  req.session.counter = 1;
  res.status(200).json({msg: "success"});
}